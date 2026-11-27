import type { PrimerSetup } from '../../domain/color/primer';
import { StudioDialog } from '../../ui/studio-dialog';
import { useStudioNotice } from '../../ui/studio-notice';
import { useLayoutEffect, useRef, useState } from 'react';
import { Bookmark } from 'lucide-react';
import type { Preparation } from '../../domain/color/dilution';
import type { RecipePaint } from '../../domain/color/saved-recipe';
import { readRecipes, updateRecipes } from '../../infrastructure/recipe-store';
export function SaveRecipe({
  paints,
  thinner,
  preparation,
  primer,
  active,
  onSaved,
  hex,
}: {
  paints: RecipePaint[];
  thinner: number;
  preparation: Preparation;
  primer?: PrimerSetup;
  active: boolean;
  onSaved: () => void;
  hex: string;
}) {
  const [name, setName] = useState('');
  const [applicationNote, setApplicationNote] = useState('');
  const notify = useStudioNotice();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (!active && dialog.current?.open) dialog.current.close();
  }, [active]);

  const [storageError] = useState(() => {
    try {
      readRecipes();
      return false;
    } catch {
      return true;
    }
  });
  return (
    <div className="mix-save">
      <button
        type="button"
        className="tool-primary mix-save-trigger"
        aria-haspopup="dialog"
        onClick={() => {
          setError('');
          dialog.current?.showModal();
          nameInput.current?.focus();
        }}
      >
        <Bookmark size={18} aria-hidden="true" /> Salvar mistura
      </button>
      <StudioDialog
        dialogRef={dialog}
        title="Salvar esta mistura"
        onCancel={(event) => {
          if (saving) event.preventDefault();
        }}
      >
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (storageError || saving || !name.trim()) return;
            setSaving(true);
            setError('');
            try {
              await updateRecipes((current) => [
                ...current,
                {
                  id: crypto.randomUUID(),
                  name: name.trim(),
                  applicationNote: applicationNote.trim() || undefined,
                  paints: paints.map(
                    ({
                      name,
                      brand,
                      hex,
                      drops,
                      tintingStrength,
                      code,
                      range,
                    }) => ({
                      name,
                      brand,
                      hex,
                      drops,
                      tintingStrength,
                      code,
                      range,
                    }),
                  ),
                  thinner,
                  preparation,
                  primer,
                  hex,
                },
              ]);
              onSaved();
              setName('');
              setApplicationNote('');
              dialog.current?.close();
              notify('Receitas atualizadas.');
            } catch {
              setError('Não foi possível gravar no navegador.');
            } finally {
              setSaving(false);
            }
          }}
        >
          <label>
            Nome da receita
            <input
              ref={nameInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </label>
          <label>
            Observação da aplicação (opcional)
            <textarea
              value={applicationNote}
              onChange={(event) => setApplicationNote(event.target.value)}
              maxLength={240}
              rows={2}
              placeholder="Peça, região ou resultado do teste"
            />
          </label>
          {storageError && (
            <p role="alert">
              Receitas locais indisponíveis. Os dados existentes não serão
              sobrescritos.
            </p>
          )}
          {error && <p role="alert">{error}</p>}
          <small>A receita fica salva neste navegador.</small>
          <div className="studio-dialog-actions">
            <button
              type="button"
              className="tool-secondary"
              disabled={saving}
              onClick={() => dialog.current?.close()}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="tool-primary"
              disabled={storageError || saving || !name.trim()}
            >
              {saving ? 'Salvando…' : 'Salvar receita'}
            </button>
          </div>
        </form>
      </StudioDialog>
    </div>
  );
}
