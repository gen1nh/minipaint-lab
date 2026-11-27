import { primers } from '../../domain/color/primer';
import { ConfirmDialog, StudioDialog } from '../../ui/studio-dialog';
import { useStudioNotice } from '../../ui/studio-notice';
import { StudioHeading } from '../../ui/studio-heading';
import { searchText } from '../../domain/search-text';
import { paintBrandLabel } from '../../domain/color/saved-recipe';
import { useEffect, useRef, useState } from 'react';
import { Archive, ArrowUpRight, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  isSavedRecipe,
  mergeRecipeBackup,
  type SavedRecipe,
} from '../../domain/color/saved-recipe';
import {
  readRecipes,
  recipeStorageKey,
  updateRecipes,
} from '../../infrastructure/recipe-store';

function exportBackup(recipes: SavedRecipe[]) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify({ version: 1, recipes }, null, 2)], {
      type: 'application/json',
    }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = 'minipaint-receitas.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const applicationLabels = {
  color: 'Só mistura',
  brush: 'Pincel',
  airbrush: 'Aerógrafo',
};
const diluentLabels = {
  water: 'Água',
  medium: 'Médium',
  'airbrush-thinner': 'Diluente de aerógrafo',
};

function RecipeApplication({ recipe }: { recipe: SavedRecipe }) {
  const { preparation, thinner, primer } = recipe;
  const application = [
    preparation && applicationLabels[preparation.application],
    preparation?.diluent && diluentLabels[preparation.diluent],
    thinner > 0 &&
      thinner +
        (thinner === 1 ? ' gota' : ' gotas') +
        (preparation?.diluent ? '' : ' de diluente'),
  ]
    .filter(Boolean)
    .join(' · ');
  const primerName = primers.find((item) => item.hex === primer?.hex)?.name;
  return (
    <div className="recipe-application">
      {application && <small>{application}</small>}
      {primer && (
        <small>
          Primer {primerName?.toLowerCase()} · {primer.layers}{' '}
          {primer.layers === 1 ? 'camada' : 'camadas'} ·{' '}
          {primer.tested ? 'Teste registrado' : 'Simulação'}
        </small>
      )}
      {recipe.applicationNote && (
        <small className="recipe-note">{recipe.applicationNote}</small>
      )}
    </div>
  );
}

export function RecipeLibrary({
  onLoad,
  onMix,
}: {
  onLoad: (recipe: SavedRecipe) => void;
  onMix: () => void;
}) {
  const [initial] = useState(() => {
    try {
      return { recipes: readRecipes(), storageError: false };
    } catch {
      return { recipes: [], storageError: true };
    }
  });
  const [saved, setSaved] = useState(initial.recipes);
  const [storageError, setStorageError] = useState(initial.storageError);
  const [compare, setCompare] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const notify = useStudioNotice();
  const [pendingDelete, setPendingDelete] = useState<SavedRecipe>();
  const noteDialog = useRef<HTMLDialogElement>(null);
  const [noteRecipe, setNoteRecipe] = useState<SavedRecipe>();
  const [note, setNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const terms = searchText(query).split(/\s+/).filter(Boolean);
  const visibleRecipes = saved.filter((recipe) => {
    const text = searchText(
      [
        recipe.name,
        recipe.applicationNote ?? '',
        ...recipe.paints.flatMap((paint) => [
          paint.name,
          paintBrandLabel(paint.brand),
          paint.code ?? '',
        ]),
      ].join(' '),
    );
    return terms.every((term) => text.includes(term));
  });

  useEffect(() => {
    function sync(event: StorageEvent) {
      if (
        event.storageArea !== localStorage ||
        (event.key !== recipeStorageKey && event.key !== null)
      )
        return;
      try {
        const latest = readRecipes();
        setSaved(latest);
        setStorageError(false);
        setCompare((ids) =>
          ids.filter((id) => latest.some((recipe) => recipe.id === id)),
        );
      } catch {
        setStorageError(true);
        notify('Não foi possível atualizar as receitas locais.', true);
      }
    }

    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [notify]);

  async function persist(update: (current: SavedRecipe[]) => SavedRecipe[]) {
    try {
      const next = await updateRecipes(update);
      setSaved(next);
      setStorageError(false);
      setCompare((ids) =>
        ids.filter((id) => next.some((recipe) => recipe.id === id)),
      );
      notify('Receitas atualizadas.');
      return true;
    } catch {
      notify('Não foi possível gravar no navegador.', true);
      return false;
    }
  }

  async function importBackup(file: File) {
    try {
      if (file.size > 2000000) throw new Error();
      const data = JSON.parse(await file.text());
      if (
        data.version !== 1 ||
        !Array.isArray(data.recipes) ||
        !data.recipes.every(isSavedRecipe)
      )
        throw new Error();
      await persist((current) =>
        mergeRecipeBackup(current, data.recipes, () => crypto.randomUUID()),
      );
    } catch {
      notify('Backup inválido ou indisponível.', true);
    }
  }

  return (
    <div className="tool-page">
      <StudioHeading
        title="Meu ateliê"
        description="Reabra e compare as misturas que você salvou."
      >
        {saved.length > 0 && (
          <button className="tool-primary" onClick={onMix}>
            <Plus size={18} aria-hidden="true" /> Misturar tintas
          </button>
        )}
      </StudioHeading>
      {!saved.length && !storageError && (
        <section className="tool-surface atelier-empty">
          <h2>Nenhuma receita salva.</h2>
          <button className="tool-primary" onClick={onMix}>
            <Plus size={18} aria-hidden="true" /> Misturar tintas
          </button>
        </section>
      )}
      {storageError && <p role="alert">Receitas locais indisponíveis.</p>}
      {!!saved.length && (
        <label className="atelier-search">
          Buscar receitas
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nome da receita, tinta ou observação"
          />
        </label>
      )}
      {!!saved.length && !visibleRecipes.length && (
        <p role="status">Nenhuma receita encontrada.</p>
      )}
      {!!visibleRecipes.length && (
        <ul className="swatch-grid saved-swatches" aria-label="Receitas salvas">
          {visibleRecipes.map((recipe) => (
            <li key={recipe.id}>
              <button className="swatch-action" onClick={() => onLoad(recipe)}>
                <span
                  className="swatch-block"
                  style={{ background: recipe.hex }}
                  aria-hidden="true"
                />
                <strong>
                  {recipe.name} · <span>{recipe.hex}</span>
                </strong>
                <RecipeApplication recipe={recipe} />
                <span className="swatch-link">
                  Abrir <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </button>
              <div className="saved-actions">
                <label className="inline-check">
                  <input
                    type="checkbox"
                    checked={compare.includes(recipe.id)}
                    onChange={(event) =>
                      setCompare((old) =>
                        event.target.checked
                          ? [...old.slice(-1), recipe.id]
                          : old.filter((id) => id !== recipe.id),
                      )
                    }
                  />{' '}
                  Comparar
                </label>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-label={`Editar observação de ${recipe.name}`}
                  onClick={() => {
                    setNoteRecipe(recipe);
                    setNote(recipe.applicationNote ?? '');
                    noteDialog.current?.showModal();
                  }}
                >
                  <Pencil size={17} aria-hidden="true" />
                </button>
                <button
                  aria-label="Excluir"
                  title={`Excluir ${recipe.name}`}
                  onClick={() => setPendingDelete(recipe)}
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!!compare.length && (
        <section className="tool-results">
          <h2>Comparação de receitas</h2>
          <div className="comparison-swatches">
            {saved
              .filter((recipe) => compare.includes(recipe.id))
              .map((recipe) => (
                <section key={recipe.id}>
                  <div
                    className="swatch-block"
                    style={{ background: recipe.hex }}
                    aria-hidden="true"
                  />
                  <h3>{recipe.name}</h3>
                  <ul>
                    {recipe.paints.map((paint, index) => (
                      <li key={index}>
                        {paint.drops} gotas ·{' '}
                        {[paintBrandLabel(paint.brand), paint.name]
                          .filter(Boolean)
                          .join(' ')}
                      </li>
                    ))}
                  </ul>
                  <RecipeApplication recipe={recipe} />
                </section>
              ))}
          </div>
        </section>
      )}
      <details className="studio-disclosure atelier-backup">
        <summary>
          <Archive size={18} aria-hidden="true" /> Backup de receitas
        </summary>
        <p>As receitas ficam neste navegador.</p>
        <button
          className="tool-secondary"
          disabled={!saved.length}
          onClick={() => exportBackup(saved)}
        >
          Exportar backup
        </button>
        <label>
          Importar backup (adiciona receitas)
          <input
            type="file"
            accept=".json,application/json"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importBackup(file);
              event.target.value = '';
            }}
          />
        </label>
      </details>
      <StudioDialog
        dialogRef={noteDialog}
        title="Observação da aplicação"
        onCancel={(event) => {
          if (savingNote) event.preventDefault();
        }}
      >
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!noteRecipe || savingNote) return;
            setSavingNote(true);
            const result = await persist((current) => {
              if (!current.some((recipe) => recipe.id === noteRecipe.id)) {
                throw new Error('Recipe no longer exists');
              }
              return current.map((recipe) =>
                recipe.id === noteRecipe.id
                  ? { ...recipe, applicationNote: note.trim() || undefined }
                  : recipe,
              );
            });
            setSavingNote(false);
            if (result) noteDialog.current?.close();
          }}
        >
          <label>
            Observação da aplicação
            <textarea
              value={note}
              rows={2}
              maxLength={240}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
          <div className="studio-dialog-actions">
            <button
              type="button"
              className="tool-secondary"
              disabled={savingNote}
              onClick={() => noteDialog.current?.close()}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="tool-primary"
              disabled={savingNote}
            >
              Salvar observação
            </button>
          </div>
        </form>
      </StudioDialog>
      <ConfirmDialog
        open={!!pendingDelete}
        title="Excluir receita?"
        description={pendingDelete?.name ?? ''}
        confirmLabel="Excluir receita"
        onCancel={() => setPendingDelete(undefined)}
        onConfirm={() => {
          const id = pendingDelete?.id;
          setPendingDelete(undefined);
          if (id)
            void persist((current) => current.filter((item) => item.id !== id));
        }}
      />
    </div>
  );
}
