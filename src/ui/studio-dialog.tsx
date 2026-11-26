import {
  useId,
  useLayoutEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from 'react';

export function StudioDialog({
  dialogRef,
  title,
  children,
  ...props
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  title: string;
  children: ReactNode;
} & Pick<ComponentProps<'dialog'>, 'onCancel' | 'onClose'>) {
  const id = useId();
  return (
    <dialog
      ref={dialogRef}
      className="studio-dialog"
      aria-labelledby={id}
      {...props}
    >
      <h2 id={id}>{title}</h2>
      {children}
    </dialog>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    const element = dialog.current;
    if (open && element && !element.open) {
      element.showModal();
      cancel.current?.focus();
    } else if (!open && element?.open) element.close();
  }, [open]);
  return (
    <StudioDialog
      dialogRef={dialog}
      title={title}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <p>{description}</p>
      <div className="studio-dialog-actions">
        <button
          ref={cancel}
          type="button"
          className="tool-secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button type="button" className="tool-primary" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </StudioDialog>
  );
}
