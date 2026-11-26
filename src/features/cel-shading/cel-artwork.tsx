import { useEffect, useMemo, useState } from 'react';
import portrait from './wikipe-tan.svg?url';
import {
  colorGoku,
  type ArtworkChoice,
  type RegionPalettes,
} from './artwork-colors';

const artwork = {
  kid: { label: 'Kid Goku', file: 'Kid Goku.svg', width: 797, height: 1073 },
  goku: { label: 'Goku', file: 'Goku SVG.svg', width: 1920, height: 1080 },
  wikipe: { label: 'Wikipe-tan', file: '', width: 400, height: 342 },
} as const;

const hairPlanes = ['deep', 'shadow', 'base', 'light', 'bright'];

export default function CelArtwork({
  choice,
  onChoose,
  palettes,
}: {
  choice: ArtworkChoice;
  onChoose: (choice: ArtworkChoice) => void;
  palettes: RegionPalettes;
}) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [assets, setAssets] = useState<Partial<Record<ArtworkChoice, string>>>(
    {},
  );
  const [failed, setFailed] = useState<ArtworkChoice>();
  const [retry, setRetry] = useState(0);
  const current = artwork[choice];
  const raw = assets[choice];
  const url =
    choice === 'wikipe'
      ? portrait
      : import.meta.env.BASE_URL +
        'artwork/' +
        encodeURIComponent(current.file);

  useEffect(() => {
    if (raw) return;
    const request = new AbortController();
    fetch(url, { signal: request.signal })
      .then((response) => {
        if (!response.ok) throw new Error('SVG indisponível');
        return response.text();
      })
      .then((source) => {
        if (!request.signal.aborted) {
          setAssets((current) => ({ ...current, [choice]: source }));
          setFailed(undefined);
        }
      })
      .catch(() => {
        if (!request.signal.aborted) setFailed(choice);
      });
    return () => request.abort();
  }, [choice, raw, url, retry]);

  const imageUrl = useMemo(() => {
    if (!raw) return undefined;
    let source = raw;
    if (choice === 'goku')
      source = source.replace(
        'width="1922" height="1251" viewBox="0 0 1922 1251"',
        'width="1920" height="1080" viewBox="1 170 1920 1080"',
      );
    if (raw && !showOriginal) {
      if (choice === 'wikipe' && palettes.hair) {
        const variables = hairPlanes
          .map((plane, index) => `--hair-${plane}:${palettes.hair?.[index]}`)
          .join(';');
        source = source.replace('<svg ', `<svg style="${variables}" `);
      } else if (choice !== 'wikipe') {
        source = colorGoku(source, palettes);
      }
    }

    return `data:image/svg+xml,${encodeURIComponent(source)}`;
  }, [raw, choice, showOriginal, palettes]);
  return (
    <figure className="cel-artwork">
      <label className="cel-artwork-select">
        Ilustração
        <select
          value={choice}
          onChange={(event) => {
            onChoose(event.target.value as ArtworkChoice);
            setShowOriginal(false);
          }}
        >
          {Object.entries(artwork).map(([id, item]) => (
            <option key={id} value={id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <div className="cel-stage">
        {imageUrl ? (
          <img
            className="cel-artwork-image"
            width={current.width}
            height={current.height}
            src={imageUrl}
            alt={`${current.label} ${showOriginal ? 'com as cores originais' : 'com as cores escolhidas para cada região'}`}
          />
        ) : (
          <p
            className="cel-artwork-loading"
            role={failed === choice ? 'alert' : 'status'}
          >
            {failed === choice
              ? 'Não foi possível carregar esta ilustração.'
              : 'Carregando ilustração…'}
          </p>
        )}
        {!imageUrl && failed === choice && (
          <button
            className="tool-secondary cel-artwork-retry"
            type="button"
            onClick={() => {
              setFailed(undefined);
              setRetry((value) => value + 1);
            }}
          >
            Tentar novamente
          </button>
        )}
      </div>
      <button
        className="tool-secondary"
        disabled={!imageUrl}
        onClick={() => setShowOriginal((value) => !value)}
      >
        {showOriginal ? 'Aplicar paleta' : 'Ver cores originais'}
      </button>
      {choice === 'wikipe' ? (
        <figcaption>
          <a href="https://commons.wikimedia.org/wiki/File:Wikipe-tan_full_length.svg">
            Wikipe-tan
          </a>
          {' · Arte de Kasuga, vetor de Editor at Large · '}
          <a href="https://creativecommons.org/licenses/by-sa/3.0/">
            CC BY-SA 3.0
          </a>
          {
            ' · Recorte e planos de cor adaptados pelo Pincel Guia (MiniPaint Lab à época)'
          }
        </figcaption>
      ) : (
        <figcaption>
          {current.label} · Dragon Ball · Vetor do autor do projeto, produzido
          no Figma.
        </figcaption>
      )}
    </figure>
  );
}
