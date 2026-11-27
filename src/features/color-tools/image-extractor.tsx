import { useStudioNotice } from '../../ui/studio-notice';
import { Crosshair, ImagePlus, ArrowRight } from 'lucide-react';
import { ColorField } from '../../ui/color-field';
import { useRef, useState } from 'react';
import { dominantColors } from '../../domain/color/image-palette';
import ReactCrop, { type PercentCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
export function ImageExtractor({ onPick }: { onPick: (hex: string) => void }) {
  const notify = useStudioNotice();
  const failed = useRef(false);
  const [palette, setPalette] = useState<string[]>([]);
  const generation = useRef(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cropTrigger = useRef<HTMLButtonElement>(null);
  const [cropping, setCropping] = useState(false);
  const [region, setRegion] = useState<PercentCrop>();
  const [crop, setCrop] = useState<PercentCrop>({
    unit: '%',
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [point, setPoint] = useState({
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    sampled: false,
  });
  const [transparent, setTransparent] = useState(false);
  const [ready, setReady] = useState(false),
    [picked, setPicked] = useState('#808080');
  function closeCrop() {
    setCropping(false);
    requestAnimationFrame(() => cropTrigger.current?.focus());
  }
  async function load(file: File) {
    const request = ++generation.current;
    setReady(false);
    setCropping(false);
    setRegion(undefined);
    if (failed.current) {
      notify('');
      failed.current = false;
    }
    setPalette([]);
    try {
      if (file.size > 20 * 1024 * 1024)
        throw new Error('Imagem maior que 20 MB');
      const bitmap = await createImageBitmap(file);
      try {
        const c = canvas.current;
        if (!c || request !== generation.current) return;
        const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
        c.width = Math.max(1, Math.round(bitmap.width * scale));
        c.height = Math.max(1, Math.round(bitmap.height * scale));
        setPoint({
          x: Math.floor(c.width / 2),
          y: Math.floor(c.height / 2),
          width: c.width,
          height: c.height,
          sampled: false,
        });
        setTransparent(false);
        const ctx = c.getContext('2d');
        if (!ctx) throw new Error('Canvas indisponível');
        ctx.drawImage(bitmap, 0, 0, c.width, c.height);
        const colors = dominantColors(
          ctx.getImageData(0, 0, c.width, c.height).data,
        );
        setPalette(colors);
        setPicked(colors[0] ?? '#808080');
        setReady(true);
      } finally {
        bitmap.close();
      }
    } catch {
      if (request === generation.current) {
        failed.current = true;
        notify(
          'Não foi possível abrir a imagem. Use PNG, JPEG ou WebP de até 20 MB.',
          true,
        );
      }
    }
  }
  function extractRegion(area?: PercentCrop) {
    const image = canvas.current;
    const context = image?.getContext('2d');
    if (!image || !context) return;
    const x = Math.min(
      image.width - 1,
      Math.floor((image.width * (area?.x ?? 0)) / 100),
    );
    const y = Math.min(
      image.height - 1,
      Math.floor((image.height * (area?.y ?? 0)) / 100),
    );
    const width = Math.min(
      image.width - x,
      Math.max(1, Math.round((image.width * (area?.width ?? 100)) / 100)),
    );
    const height = Math.min(
      image.height - y,
      Math.max(1, Math.round((image.height * (area?.height ?? 100)) / 100)),
    );
    const colors = dominantColors(
      context.getImageData(x, y, width, height).data,
    );
    setPalette(colors);
    setPicked(colors[0] ?? '#808080');
    setPoint((current) => ({ ...current, sampled: false }));
    setTransparent(false);
    setRegion(area);
    closeCrop();
  }
  function sample(x: number, y: number) {
    const c = canvas.current;
    if (!c || !ready) return;
    const column = Math.max(0, Math.min(c.width - 1, x));
    const row = Math.max(0, Math.min(c.height - 1, y));
    setPoint({
      x: column,
      y: row,
      width: c.width,
      height: c.height,
      sampled: true,
    });
    const p = c.getContext('2d')?.getImageData(column, row, 1, 1).data;
    setTransparent(!p || p[3] === 0);
    if (!p || p[3] === 0) return;
    setPicked(
      '#' +
        Array.from(p.slice(0, 3))
          .map((v) => v.toString(16).padStart(2, '0'))
          .join(''),
    );
  }
  return (
    <section className="tool-surface image-workbench">
      <div className="image-stage">
        <label className="image-upload">
          <ImagePlus size={ready ? 20 : 44} aria-hidden="true" />
          <strong>
            {ready ? 'Trocar imagem' : 'Escolher imagem de referência'}
          </strong>
          {!ready && <small>PNG, JPEG ou WebP</small>}
          <input
            type="file"
            aria-label="Imagem de referência"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void load(file);
              event.target.value = '';
            }}
          />
        </label>
        <div className="image-sampling" hidden={!ready}>
          <ReactCrop
            crop={cropping ? crop : undefined}
            disabled={!cropping}
            onChange={(_, percent) => setCrop(percent)}
            ariaLabels={{
              cropArea: 'Área da imagem para recorte',
              nwDragHandle: 'Canto superior esquerdo',
              nDragHandle: 'Borda superior',
              neDragHandle: 'Canto superior direito',
              eDragHandle: 'Borda direita',
              seDragHandle: 'Canto inferior direito',
              sDragHandle: 'Borda inferior',
              swDragHandle: 'Canto inferior esquerdo',
              wDragHandle: 'Borda esquerda',
            }}
          >
            <canvas
              ref={canvas}
              className="image-canvas"
              aria-label="Imagem para selecionar uma cor"
              onClick={(event) => {
                if (cropping) return;
                const bounds = event.currentTarget.getBoundingClientRect();
                sample(
                  Math.floor(
                    ((event.clientX - bounds.left) *
                      event.currentTarget.width) /
                      bounds.width,
                  ),
                  Math.floor(
                    ((event.clientY - bounds.top) *
                      event.currentTarget.height) /
                      bounds.height,
                  ),
                );
              }}
            />
          </ReactCrop>
          {point.sampled && !cropping && (
            <span
              aria-hidden="true"
              className="image-sample-marker"
              style={{
                left: `${(100 * (point.x + 0.5)) / point.width}%`,
                top: `${(100 * (point.y + 0.5)) / point.height}%`,
              }}
            />
          )}
        </div>
      </div>
      {ready && (
        <div className="tool-settings">
          <div className="image-crop-actions">
            {cropping ? (
              <>
                <button
                  type="button"
                  className="tool-primary"
                  disabled={!crop.width || !crop.height}
                  onClick={() => extractRegion(crop)}
                >
                  Extrair cores do recorte
                </button>
                <button
                  type="button"
                  className="tool-secondary"
                  onClick={closeCrop}
                >
                  Cancelar recorte
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  ref={cropTrigger}
                  className="tool-secondary"
                  onClick={() => {
                    setCrop(
                      region ?? {
                        unit: '%',
                        x: 10,
                        y: 10,
                        width: 80,
                        height: 80,
                      },
                    );
                    setCropping(true);
                    requestAnimationFrame(() => {
                      canvas.current
                        ?.closest('.ReactCrop')
                        ?.querySelector<HTMLElement>(
                          '[aria-label="Área da imagem para recorte"]',
                        )
                        ?.focus();
                    });
                  }}
                >
                  Recortar referência
                </button>
                {region && (
                  <button
                    type="button"
                    className="tool-secondary"
                    onClick={() => extractRegion()}
                  >
                    Usar imagem inteira
                  </button>
                )}
              </>
            )}
          </div>
          {region && !cropping && (
            <small role="status">Paleta extraída do recorte.</small>
          )}
          {!palette.length && (
            <p role="status">Nenhuma cor visível na seleção.</p>
          )}
          <ColorField
            label="Cor selecionada"
            hex={picked}
            onChange={setPicked}
          />
          <div
            className="image-palette"
            role="group"
            aria-label="Cores da imagem"
          >
            {palette.map((hex) => (
              <button
                key={hex}
                aria-label={hex}
                aria-pressed={picked === hex}
                style={{ background: hex }}
                onClick={() => setPicked(hex)}
              />
            ))}
          </div>
          <fieldset className="image-coordinates">
            <legend>Ponto na imagem</legend>
            <label>
              Coluna ({point.x + 1} de {point.width})
              <input
                type="range"
                aria-label="Coluna da amostra"
                min={0}
                max={point.width - 1}
                value={point.x}
                onChange={(event) =>
                  sample(Number(event.target.value), point.y)
                }
              />
            </label>
            <label>
              Linha ({point.y + 1} de {point.height})
              <input
                type="range"
                aria-label="Linha da amostra"
                min={0}
                max={point.height - 1}
                value={point.y}
                onChange={(event) =>
                  sample(point.x, Number(event.target.value))
                }
              />
            </label>
            {transparent && (
              <small role="status">
                Ponto transparente. A cor selecionada foi mantida.
              </small>
            )}
          </fieldset>
          <button
            className="tool-secondary"
            onClick={() => {
              const image = canvas.current;
              if (image)
                sample(
                  Math.floor(image.width / 2),
                  Math.floor(image.height / 2),
                );
            }}
          >
            <Crosshair size={18} aria-hidden="true" /> Selecionar centro
          </button>
          <button className="tool-primary" onClick={() => onPick(picked)}>
            Buscar esta cor <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
