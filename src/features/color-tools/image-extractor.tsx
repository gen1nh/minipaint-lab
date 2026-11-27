import { useStudioNotice } from '../../ui/studio-notice';
import { Crosshair, ImagePlus, ArrowRight } from 'lucide-react';
import { ColorField } from '../../ui/color-field';
import { useRef, useState } from 'react';
import { dominantColors } from '../../domain/color/image-palette';
export function ImageExtractor({ onPick }: { onPick: (hex: string) => void }) {
  const notify = useStudioNotice();
  const failed = useRef(false);
  const [palette, setPalette] = useState<string[]>([]);
  const generation = useRef(0);
  const canvas = useRef<HTMLCanvasElement>(null);
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
  async function load(file: File) {
    const request = ++generation.current;
    setReady(false);
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
          <canvas
            ref={canvas}
            className="image-canvas"
            aria-label="Imagem para selecionar uma cor"
            onClick={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect();
              sample(
                Math.floor(
                  ((event.clientX - bounds.left) * event.currentTarget.width) /
                    bounds.width,
                ),
                Math.floor(
                  ((event.clientY - bounds.top) * event.currentTarget.height) /
                    bounds.height,
                ),
              );
            }}
          />
          {point.sampled && (
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
