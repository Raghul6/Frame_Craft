import { Plus } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import DetailShell from "../../../components/admin/DetailShell";
import SizeRowEditor from "../../../components/admin/SizeRowEditor";
import Alert from "../../../components/common/Alert";
import FormField from "../../../components/common/FormField";
import {
  DESCRIPTION_ROWS,
  FRAME_FIELD_LIMITS,
  FRAME_SIZE_PRESETS,
} from "../../../constants/admin";
import {
  selectCurrentFrame,
  selectFrameSave,
} from "../../../features/frames/selectors";
import { frameSaveErrorsCleared } from "../../../features/frames/slice";
import { fetchFrame, saveFrame } from "../../../features/frames/thunks";
import { useRouteId } from "../../../hooks/useRouteId";
import type { SizePreset } from "../../../types/admin";
import type { FieldErrors } from "../../../types/api";
import type { FrameFormState, SizeRow } from "../../../types/forms";
import { formatMoney } from "../../../utils/format";
import {
  createEmptyFrameForm,
  emptySizeRow,
  formToFrameInput,
  frameToForm,
  lowestPrice,
  presetChipText,
  sizeKey,
  validateFrameForm,
} from "../../../utils/frameForm";
import "./AdminFrameFormPage.css";
import ButtonLabel from "../../../components/common/ButtonLabel";
import { ICON_SIZE } from "../../../constants/ui";
import {
  BUTTON_LABELS,
  INVALID_LINK_MESSAGES,
} from "../../../constants/messages";

/** Errors for one size row, e.g. { width: "Width > 0" } from "sizes.2.width". */
const rowErrors = (errors: FieldErrors, index: number) => {
  const prefix = `sizes.${index}.`;
  return Object.fromEntries(
    Object.entries(errors)
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, message]) => [key.slice(prefix.length), message]),
  );
};

const AdminFrameFormPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasIdParam = useParams().id !== undefined;
  const editId = useRouteId();
  const current = useAppSelector(selectCurrentFrame);
  const save = useAppSelector(selectFrameSave);
  const saving = save.status === "loading";

  const [form, setForm] = useState<FrameFormState>(createEmptyFrameForm);
  const [localErrors, setLocalErrors] = useState<FieldErrors>({});
  useEffect(() => {
    dispatch(frameSaveErrorsCleared());
    if (editId) void dispatch(fetchFrame(editId));
  }, [dispatch, editId]);

  // Refill the form whenever a (new version of the) frame for this URL arrives,
  // e.g. after load or after saving — so new sizes pick up their ids.
  const loadedFrame =
    editId && current.frame?.id === editId ? current.frame : null;
  const loadedVersion = loadedFrame
    ? `${loadedFrame.id}@${loadedFrame.updatedAt}`
    : null;
  const [filledFrom, setFilledFrom] = useState<string | null>(null);
  if (loadedFrame && loadedVersion !== filledFrom) {
    setFilledFrom(loadedVersion);
    setForm(frameToForm(loadedFrame));
    setLocalErrors({});
  }

  const errors: FieldErrors = { ...save.fieldErrors, ...localErrors };

  const clearErrors = (match: (key: string) => boolean) => {
    setLocalErrors((e) =>
      Object.fromEntries(Object.entries(e).filter(([k]) => !match(k))),
    );
    if (Object.keys(save.fieldErrors).length)
      dispatch(frameSaveErrorsCleared());
  };

  const setField = <K extends keyof FrameFormState>(
    key: K,
    value: FrameFormState[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    clearErrors((k) => k === key);
  };

  // Size errors are keyed by row index, so any change to the rows invalidates them.
  const updateSizes = (update: (rows: SizeRow[]) => SizeRow[]) => {
    setForm((f) => ({ ...f, sizes: update(f.sizes) }));
    clearErrors((k) => k.startsWith("sizes"));
  };

  const updateRow = (key: string, patch: Partial<SizeRow>) =>
    updateSizes((rows) =>
      rows.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    );
  const removeRow = (key: string) =>
    updateSizes((rows) => rows.filter((r) => r.key !== key));
  const addRow = (preset?: SizePreset) =>
    updateSizes((rows) => [...rows, emptySizeRow(preset)]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateFrameForm(form);
    setLocalErrors(found);
    if (Object.keys(found).length) return;

    // The thunk shows the success / error toast; field errors come back via `save.fieldErrors`.
    const frame = await dispatch(
      saveFrame(formToFrameInput(form), editId ?? undefined),
    );
    // A new frame continues on its edit page (the "created" toast stays up across the move).
    if (frame && !editId)
      navigate(`/admin/frames/${frame.id}`, { replace: true });
  };

  const addedSizes = new Set(
    form.sizes.map((r) => sizeKey(r.width, r.height, r.unit)),
  );
  const fromPrice = lowestPrice(form);

  // "/admin/frames/abc" is not a frame — never fall back to a create form.
  if (hasIdParam && !editId) {
    return (
      <div className="admin-page">
        <Alert>{INVALID_LINK_MESSAGES.frame}</Alert>
      </div>
    );
  }

  return (
    <DetailShell
      backTo="/admin/frames"
      backLabel="All frames"
      status={editId ? current.status : "succeeded"}
      error={current.error}
      ready={!editId || loadedFrame !== null}
    >
      <AdminPageHeader
        title={loadedFrame ? `Edit ${loadedFrame.name}` : "Add a frame"}
        description="Set the frame details, then add each size it's sold in with its own price."
      />

      <form onSubmit={submit} noValidate className="frame-form">
        {/* Locked while saving so nothing typed meanwhile is lost when the saved frame refills the form. */}
        <fieldset className="form-lock" disabled={saving}>
          <section className="admin-panel">
            <h2>Details</h2>
            <div className="form-grid">
              <FormField
                id="name"
                label="Frame name *"
                error={errors.name}
                className="span-2"
              >
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  placeholder="The Alder"
                  maxLength={FRAME_FIELD_LIMITS.name}
                />
              </FormField>
              <FormField id="material" label="Material">
                <input
                  id="material"
                  value={form.material}
                  onChange={(e) => setField("material", e.target.value)}
                  placeholder="Oak, walnut, brass…"
                  maxLength={FRAME_FIELD_LIMITS.material}
                />
              </FormField>
              <FormField id="color" label="Colour / finish">
                <input
                  id="color"
                  value={form.color}
                  onChange={(e) => setField("color", e.target.value)}
                  placeholder="Natural, black…"
                  maxLength={FRAME_FIELD_LIMITS.color}
                />
              </FormField>
              <FormField
                id="imageUrl"
                label="Image URL"
                error={errors.imageUrl}
                className="span-2"
              >
                <input
                  id="imageUrl"
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setField("imageUrl", e.target.value)}
                  aria-invalid={!!errors.imageUrl}
                  placeholder="https://…"
                  maxLength={FRAME_FIELD_LIMITS.imageUrl}
                />
              </FormField>
              <FormField
                id="description"
                label="Description"
                className="span-2"
              >
                <textarea
                  id="description"
                  rows={DESCRIPTION_ROWS}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  maxLength={FRAME_FIELD_LIMITS.description}
                />
              </FormField>
              <label className="toggle span-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setField("isActive", e.target.checked)}
                />
                <span>
                  <strong>Active</strong> — uncheck to hide this frame from the
                  store without deleting it
                </span>
              </label>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-header">
              <h2>Sizes &amp; prices</h2>
              <button
                type="button"
                className="btn btn-secondary admin-btn"
                onClick={() => addRow()}
              >
                <Plus size={ICON_SIZE.md} /> Custom size
              </button>
            </div>

            <div className="preset-row">
              <span>Quick add:</span>
              {FRAME_SIZE_PRESETS.map((preset) => {
                const key = sizeKey(preset.width, preset.height, preset.unit);
                const added = addedSizes.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    className="preset-chip"
                    onClick={() => addRow(preset)}
                    disabled={added}
                    title={
                      added ? "Already added" : `Add ${presetChipText(preset)}`
                    }
                  >
                    {presetChipText(preset)}
                  </button>
                );
              })}
            </div>

            {errors.sizes && (
              <div className="field-error block">{errors.sizes}</div>
            )}

            {form.sizes.length > 0 && (
              <div className="size-editor">
                <div className="size-editor-head" aria-hidden>
                  <span>Width</span>
                  <span />
                  <span>Height</span>
                  <span>Unit</span>
                  <span>Label</span>
                  <span>Price ($)</span>
                  <span>Stock</span>
                  <span />
                </div>
                {form.sizes.map((row, i) => (
                  <SizeRowEditor
                    key={row.key}
                    row={row}
                    index={i}
                    errors={rowErrors(errors, i)}
                    onChange={updateRow}
                    onRemove={removeRow}
                  />
                ))}
              </div>
            )}

            {fromPrice !== null && (
              <p className="size-summary">
                {form.sizes.length} size{form.sizes.length === 1 ? "" : "s"} ·
                from {formatMoney(fromPrice)}
              </p>
            )}
          </section>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary admin-btn"
              onClick={() => navigate("/admin/frames")}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary admin-btn">
              <ButtonLabel
                loading={saving}
                {...(editId
                  ? BUTTON_LABELS.saveFrame
                  : BUTTON_LABELS.createFrame)}
              />
            </button>
          </div>
        </fieldset>
      </form>
    </DetailShell>
  );
};

export default AdminFrameFormPage;
