import { useMemo, useState } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineGrid,
  InlineStack,
  RadioButton,
  TextField,
  Button,
  ChoiceList,
  Select,
  Checkbox,
  Box,
  RangeSlider,
  Divider,
  Scrollable, // ⬅️ added
} from "@shopify/polaris";

/** ---------- Small helper: Color input + hex field side-by-side ---------- */
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <BlockStack gap="150">
      <Text as="span" variant="bodySm">
        {label}
      </Text>
      <InlineStack gap="200" blockAlign="center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 36,
            height: 28,
            border: "1px solid #E3E3E3",
            borderRadius: 6,
            padding: 0,
            background: "transparent",
          }}
          aria-label={label}
        />
        <div style={{ flex: 1 }}>
          <TextField
            labelHidden
            label={`${label} hex`}
            value={value}
            onChange={onChange}
            autoComplete="off"
          />
        </div>
      </InlineStack>
    </BlockStack>
  );
}

/** ---------- Types ---------- */
type Unit = {
  id: string;
  title: string;
  save: string; // e.g. "20%"
  price: string; // e.g. "Rs.39.92"
  compareAt: string; // e.g. "Rs.49.90"
  most: boolean;
};

/** ---------- Utilities ---------- */
const currency = (n: number) =>
  `Rs.${n.toFixed(2)}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

const extractNumber = (s: string) => {
  // Pull numeric part from strings like "Rs.39.92" or "49.90"
  const m = s.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  return m ? parseFloat(m[0]) : 0;
};

/** =======================================================================
 *  OfferBuilder (final polished)
 *  ======================================================================= */
export default function OfferBuilder() {
  /** === Left panel state === */
  const [offerName, setOfferName] = useState<string>("New offer");
  const [product] = useState<string>("Selling Plans Ski Wax");
  const [selectedUnit, setSelectedUnit] = useState<string>("1 Unit");

  const [units, setUnits] = useState<Unit[]>([
    {
      id: "1",
      title: "1 Unit",
      save: "0%",
      price: "Rs.24.95",
      compareAt: "",
      most: false,
    },
    {
      id: "2",
      title: "2 Units",
      save: "20%",
      price: "Rs.39.92",
      compareAt: "Rs.49.90",
      most: true,
    },
    {
      id: "3",
      title: "3 Units",
      save: "30%",
      price: "Rs.52.39",
      compareAt: "Rs.74.95",
      most: true,
    },
  ]);

  /** === Design / template settings === */
  const [template, setTemplate] = useState<string>("classic"); // classic | modern | vertical
  const [offerPlacement, setOfferPlacement] = useState<string[]>(["inside"]); // inside | above

  // Card container
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [borderColor, setBorderColor] = useState<string>("#DFE3E8");
  const [radius, setRadius] = useState<number>(12);

  // Fallback text color
  const [textColor, setTextColor] = useState<string>("#1F2937");

  // Tag ("Save xx%")
  const [tagBgColor, setTagBgColor] = useState<string>("#EBF5EA");
  const [tagTextColor, setTagTextColor] = useState<string>("#1F1F1F");
  const [tagTextSize, setTagTextSize] = useState<string>("14");
  const [tagBold, setTagBold] = useState<boolean>(false);
  const [tagItalic, setTagItalic] = useState<boolean>(false);

  // Label chip (unit title)
  const [labelBgColor, setLabelBgColor] = useState<string>("#F7F1D1");
  const [labelTextColor, setLabelTextColor] = useState<string>("#111827");
  const [labelTextSize, setLabelTextSize] = useState<string>("14");
  const [labelBold, setLabelBold] = useState<boolean>(true);
  const [labelItalic, setLabelItalic] = useState<boolean>(false);

  // Title (general heading text tone for product name etc.)
  const [titleTextColor, setTitleTextColor] = useState<string>("#111827");
  const [titleTextSize, setTitleTextSize] = useState<string>("16");
  const [titleBold, setTitleBold] = useState<boolean>(false);
  const [titleItalic, setTitleItalic] = useState<boolean>(false);

  // Price styles
  const [priceTextColor, setPriceTextColor] = useState<string>("#0B0F17");
  const [priceTextSize, setPriceTextSize] = useState<string>("18");
  const [priceBold, setPriceBold] = useState<boolean>(true);
  const [priceItalic, setPriceItalic] = useState<boolean>(false);

  // Non-selected offers style
  const [nsBgColor, setNsBgColor] = useState<string>("#FFFFFF");
  const [nsBorderColor, setNsBorderColor] = useState<string>("#E5E7EB");
  const [nsTagBgColor, setNsTagBgColor] = useState<string>("#FECACA");

  // Other toggles (kept for future logic / theme parity)
  const [useCompareAtAsOld, setUseCompareAtAsOld] = useState<boolean>(true);
  const [disableVariants, setDisableVariants] = useState<boolean>(false);
  const [hideProductImage, setHideProductImage] = useState<boolean>(false);

  /** Customer form (for preview only) */
  const [customer, setCustomer] = useState<{
    name: string;
    phone: string;
    address: string;
    region: string;
  }>({ name: "", phone: "", address: "", region: "" });
  const [subscribe, setSubscribe] = useState<boolean>(false);

  /** === Helpers === */
  const updateUnit = (index: number, patch: Partial<Unit>) => {
    setUnits((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      // keep selection stable if title changes
      if (selectedUnit === prev[index].title && patch.title) {
        setSelectedUnit(patch.title);
      }
      return next;
    });
  };

  const addUnit = () => {
    const n = units.length + 1;
    setUnits((prev) => [
      ...prev,
      {
        id: String(n),
        title: `${n} Units`,
        save: "0%",
        price: "Rs.0.00",
        compareAt: "",
        most: false,
      },
    ]);
  };

  const removeUnit = (index: number) => {
    setUnits((prev) => {
      const removed = prev[index];
      const next = prev.filter((_, i) => i !== index);
      // if we removed the selected one, select the first available
      if (removed?.title === selectedUnit && next[0]) {
        setSelectedUnit(next[0].title);
      }
      return next;
    });
  };

  /** === Styles (memoized) === */
  const unitCardStyle = (active: boolean): React.CSSProperties => ({
    border: `1px solid ${active ? borderColor : nsBorderColor}`,
    boxShadow: active ? "0 6px 16px rgba(0,0,0,0.06)" : "none",
    borderRadius: radius,
    background: active ? bgColor : nsBgColor,
    color: textColor,
    transition: "box-shadow 120ms ease, transform 120ms ease",
    cursor: "pointer",
  });

  const priceStyle = useMemo<React.CSSProperties>(
    () => ({
      fontSize: Number(priceTextSize),
      color: priceTextColor,
      fontWeight: priceBold ? 700 : 400,
      fontStyle: priceItalic ? "italic" : "normal",
      lineHeight: 1.1,
    }),
    [priceTextSize, priceTextColor, priceBold, priceItalic]
  );

  const chipStyle = useMemo<React.CSSProperties>(
    () => ({
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 999,
      background: labelBgColor,
      color: labelTextColor,
      fontSize: Number(labelTextSize),
      fontWeight: labelBold ? 700 : 500,
      fontStyle: labelItalic ? "italic" : "normal",
      border: "1px solid rgba(0,0,0,0.05)",
    }),
    [labelBgColor, labelTextColor, labelTextSize, labelBold, labelItalic]
  );

  const tagStyle = useMemo<React.CSSProperties>(
    () => ({
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 8,
      background: tagBgColor,
      color: tagTextColor,
      fontSize: Number(tagTextSize),
      fontWeight: tagBold ? 700 : 500,
      fontStyle: tagItalic ? "italic" : "normal",
    }),
    [tagBgColor, tagTextColor, tagTextSize, tagBold, tagItalic]
  );

  const subduedLineThrough = { textDecoration: "line-through", opacity: 0.65 };

  const titleToneStyle = useMemo<React.CSSProperties>(
    () => ({
      color: titleTextColor,
      fontSize: Number(titleTextSize),
      fontWeight: titleBold ? 700 : 500,
      fontStyle: titleItalic ? "italic" : "normal",
    }),
    [titleTextColor, titleTextSize, titleBold, titleItalic]
  );

  /** === Derived totals (preview) === */
  const selected = useMemo(
    () => units.find((u) => u.title === selectedUnit) || units[0],
    [units, selectedUnit]
  );
  const subtotal = extractNumber(selected?.price || "0");
  const compareAt = useCompareAtAsOld
    ? extractNumber(selected?.compareAt || "0")
    : 0;
  const discount = compareAt > 0 ? Math.max(compareAt - subtotal, 0) : 0;
  const shipping = 0; // Free shipping in preview
  const total = Math.max(subtotal - discount + shipping, 0);

  /** === Unit Card (single) === */
  const UnitCard = ({ u, active }: { u: Unit; active: boolean }) => (
    <div
      role="button"
      aria-pressed={active}
      tabIndex={0}
      onClick={() => setSelectedUnit(u.title)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setSelectedUnit(u.title);
      }}
      style={unitCardStyle(active)}
    >
      <Box padding="300">
        <BlockStack gap="200">
          <InlineStack gap="200" blockAlign="center">
            <RadioButton
              label=""
              labelHidden
              checked={active}
              onChange={() => setSelectedUnit(u.title)}
            />
            <span style={chipStyle}>{u.title}</span>
            {u.most ? (
              <span
                style={{
                  ...tagStyle,
                  background: active ? tagBgColor : nsTagBgColor,
                }}
              >
                Most popular
              </span>
            ) : null}
          </InlineStack>

          <InlineStack align="space-between" blockAlign="center">
            <span style={tagStyle}>Save {u.save}</span>
          </InlineStack>

          <BlockStack gap="050">
            {useCompareAtAsOld && u.compareAt ? (
              <Text as="p" tone="subdued">
                <span style={subduedLineThrough}>{u.compareAt}</span>
              </Text>
            ) : null}
            <span style={priceStyle}>
              <Text as="p" variant="headingMd">
                {u.price}
              </Text>
            </span>
          </BlockStack>
        </BlockStack>
      </Box>
    </div>
  );

  /** === Templates === */
  const renderPreviewLayout = () => {
    if (template === "classic") {
      return (
        <InlineGrid columns={3} gap="300">
          {units.map((u) => (
            <UnitCard key={u.id} u={u} active={selectedUnit === u.title} />
          ))}
        </InlineGrid>
      );
    }

    if (template === "modern") {
      return (
        <BlockStack gap="200">
          {units.map((u) => (
            <UnitCard key={u.id} u={u} active={selectedUnit === u.title} />
          ))}
        </BlockStack>
      );
    }

    // vertical
    return (
      <InlineGrid columns={1} gap="200">
        {units.map((u) => (
          <UnitCard key={u.id} u={u} active={selectedUnit === u.title} />
        ))}
      </InlineGrid>
    );
  };

  /** === Render === */
  return (
    <Page title="Offer Builder" fullWidth>
      <Layout>
        {/* LEFT: Form Panel */}
        <Layout.Section>
          <BlockStack gap="400">
            {/* Offer name */}
            <Card>
              <Box padding="300">
                <TextField
                  label="Offer name"
                  value={offerName}
                  onChange={setOfferName}
                  autoComplete="off"
                />
              </Box>
            </Card>

            {/* Product select (mock) */}
            <Card>
              <Box padding="300">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm">
                    Create offers for these products. (1 selected)
                  </Text>
                  <InlineStack align="space-between" blockAlign="center">
                    <span style={titleToneStyle}>
                      <Text as="h2">{product}</Text>
                    </span>
                    <Button>Change product</Button>
                  </InlineStack>
                </BlockStack>
              </Box>
            </Card>

            {/* Offers list (editable) */}
            <Card>
              <Box padding="300">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Offers
                  </Text>
                  <Button variant="primary" onClick={addUnit}>
                    Add offer
                  </Button>
                </InlineStack>
              </Box>
              <Divider />
              <BlockStack gap="300">
                {units.map((u, i) => (
                  <Card key={u.id}>
                    <Box padding="300">
                      <InlineStack
                        align="space-between"
                        blockAlign="center"
                        gap="200"
                      >
                        <InlineStack gap="200" blockAlign="center">
                          <Text as="h2" variant="headingSm">
                            {u.title}
                          </Text>
                          {u.most ? (
                            <Text as="span" tone="success">
                              • Most popular
                            </Text>
                          ) : null}
                        </InlineStack>

                        <InlineStack gap="200">
                          <Button
                            onClick={() => updateUnit(i, { most: !u.most })}
                          >
                            {u.most ? "Unset most popular" : "Set most popular"}
                          </Button>
                          <Button tone="critical" onClick={() => removeUnit(i)}>
                            Remove
                          </Button>
                        </InlineStack>
                      </InlineStack>

                      <Box paddingBlockStart="200">
                        <InlineGrid columns={4} gap="200">
                          <TextField
                            label="Label"
                            value={u.title}
                            onChange={(v) => updateUnit(i, { title: v })}
                            autoComplete="off"
                          />
                          <TextField
                            label="Save %"
                            value={u.save}
                            onChange={(v) => updateUnit(i, { save: v })}
                            autoComplete="off"
                          />
                          <TextField
                            label="Price"
                            value={u.price}
                            onChange={(v) => updateUnit(i, { price: v })}
                            autoComplete="off"
                          />
                          <TextField
                            label="Compare at"
                            value={u.compareAt}
                            onChange={(v) => updateUnit(i, { compareAt: v })}
                            autoComplete="off"
                          />
                        </InlineGrid>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </BlockStack>
            </Card>

            {/* Design */}
            <Card>
              <Box padding="300">
                <BlockStack gap="400">
                  <Text as="h1" variant="headingSm">
                    Design
                  </Text>

                  {/* Template */}
                  <Text as="h1" variant="headingSm">
                    Template
                  </Text>
                  <ChoiceList
                    title=""
                    choices={[
                      { label: "Classic (3-up)", value: "classic" },
                      { label: "Modern (stacked)", value: "modern" },
                      { label: "Vertical (single column)", value: "vertical" },
                    ]}
                    selected={[template]}
                    onChange={(v) => setTemplate(v[0])}
                  />

                  <ChoiceList
                    title="Show offers in:"
                    choices={[
                      { label: "Inside the form", value: "inside" },
                      { label: "Above Buy Button", value: "above" },
                    ]}
                    selected={offerPlacement}
                    onChange={setOfferPlacement}
                  />

                  {/* Background & border */}
                  <InlineGrid columns={2} gap="300">
                    <ColorField
                      label="Card background (selected)"
                      value={bgColor}
                      onChange={setBgColor}
                    />
                    <ColorField
                      label="Border color (selected)"
                      value={borderColor}
                      onChange={setBorderColor}
                    />
                  </InlineGrid>

                  {/* Tag text */}
                  <Card>
                    <Box padding="300">
                      <BlockStack gap="300">
                        <Text as="h1" variant="headingSm">
                          Tag (“Save xx%”)
                        </Text>
                        <InlineGrid columns={3} gap="300">
                          <ColorField
                            label="Tag background"
                            value={tagBgColor}
                            onChange={setTagBgColor}
                          />
                          <ColorField
                            label="Text color"
                            value={tagTextColor}
                            onChange={setTagTextColor}
                          />
                          <Select
                            label="Text size"
                            options={[
                              { label: "12 px", value: "12" },
                              { label: "14 px", value: "14" },
                              { label: "16 px", value: "16" },
                            ]}
                            value={tagTextSize}
                            onChange={setTagTextSize}
                          />
                        </InlineGrid>
                        <InlineStack gap="300">
                          <Checkbox
                            label="Bold"
                            checked={tagBold}
                            onChange={setTagBold}
                          />
                          <Checkbox
                            label="Italic"
                            checked={tagItalic}
                            onChange={setTagItalic}
                          />
                        </InlineStack>
                      </BlockStack>
                    </Box>
                  </Card>

                  {/* Label chip */}
                  <Card>
                    <Box padding="300">
                      <BlockStack gap="300">
                        <Text as="h1" variant="headingSm">
                          Label chip
                        </Text>
                        <InlineGrid columns={3} gap="300">
                          <ColorField
                            label="Background"
                            value={labelBgColor}
                            onChange={setLabelBgColor}
                          />
                          <ColorField
                            label="Text color"
                            value={labelTextColor}
                            onChange={setLabelTextColor}
                          />
                          <Select
                            label="Text size"
                            options={[
                              { label: "12 px", value: "12" },
                              { label: "14 px", value: "14" },
                              { label: "16 px", value: "16" },
                            ]}
                            value={labelTextSize}
                            onChange={setLabelTextSize}
                          />
                        </InlineGrid>
                        <InlineStack gap="300">
                          <Checkbox
                            label="Bold"
                            checked={labelBold}
                            onChange={setLabelBold}
                          />
                          <Checkbox
                            label="Italic"
                            checked={labelItalic}
                            onChange={setLabelItalic}
                          />
                        </InlineStack>
                      </BlockStack>
                    </Box>
                  </Card>

                  {/* Title text */}
                  <Card>
                    <Box padding="300">
                      <BlockStack gap="300">
                        <Text as="h1" variant="headingSm">
                          Title tone
                        </Text>
                        <InlineGrid columns={2} gap="300">
                          <ColorField
                            label="Text color"
                            value={titleTextColor}
                            onChange={setTitleTextColor}
                          />
                          <Select
                            label="Text size"
                            options={[
                              { label: "14 px", value: "14" },
                              { label: "16 px", value: "16" },
                              { label: "18 px", value: "18" },
                            ]}
                            value={titleTextSize}
                            onChange={setTitleTextSize}
                          />
                        </InlineGrid>
                        <InlineStack gap="300">
                          <Checkbox
                            label="Bold"
                            checked={titleBold}
                            onChange={setTitleBold}
                          />
                          <Checkbox
                            label="Italic"
                            checked={titleItalic}
                            onChange={setTitleItalic}
                          />
                        </InlineStack>
                      </BlockStack>
                    </Box>
                  </Card>

                  {/* Price text */}
                  <Card>
                    <Box padding="300">
                      <BlockStack gap="300">
                        <Text as="h1" variant="headingSm">
                          Price
                        </Text>
                        <InlineGrid columns={2} gap="300">
                          <ColorField
                            label="Text color"
                            value={priceTextColor}
                            onChange={setPriceTextColor}
                          />
                          <Select
                            label="Text size"
                            options={[
                              { label: "16 px", value: "16" },
                              { label: "18 px", value: "18" },
                              { label: "20 px", value: "20" },
                            ]}
                            value={priceTextSize}
                            onChange={setPriceTextSize}
                          />
                        </InlineGrid>
                        <InlineStack gap="300">
                          <Checkbox
                            label="Bold"
                            checked={priceBold}
                            onChange={setPriceBold}
                          />
                          <Checkbox
                            label="Italic"
                            checked={priceItalic}
                            onChange={setPriceItalic}
                          />
                        </InlineStack>
                      </BlockStack>
                    </Box>
                  </Card>

                  {/* Rounded corners */}
                  <BlockStack gap="150">
                    <Text as="h1" variant="headingSm">
                      Rounded corners
                    </Text>
                    <RangeSlider
                      labelHidden
                      label="Rounded corners"
                      value={radius}
                      min={0}
                      max={24}
                      step={1}
                      onChange={(value) => {
                        if (typeof value === "number") setRadius(value);
                        else if (Array.isArray(value)) setRadius(value[0]);
                      }}
                    />
                  </BlockStack>

                  {/* Non-selected offers style */}
                  <Card>
                    <Box padding="300">
                      <BlockStack gap="300">
                        <Text as="h1" variant="headingSm">
                          Non-selected offers style
                        </Text>
                        <InlineGrid columns={3} gap="300">
                          <ColorField
                            label="Background"
                            value={nsBgColor}
                            onChange={setNsBgColor}
                          />
                          <ColorField
                            label="Border"
                            value={nsBorderColor}
                            onChange={setNsBorderColor}
                          />
                          <ColorField
                            label="Tag background"
                            value={nsTagBgColor}
                            onChange={setNsTagBgColor}
                          />
                        </InlineGrid>
                      </BlockStack>
                    </Box>
                  </Card>

                  {/* Other options */}
                  <Card>
                    <Box padding="300">
                      <BlockStack gap="150">
                        <Checkbox
                          label="Use the comparison price as the old price in each offer"
                          checked={useCompareAtAsOld}
                          onChange={setUseCompareAtAsOld}
                        />
                        <Checkbox
                          label="Disable variants selection (if the product has variants)"
                          checked={disableVariants}
                          onChange={setDisableVariants}
                        />
                        <Checkbox
                          label="Hide the product image"
                          checked={hideProductImage}
                          onChange={setHideProductImage}
                        />
                      </BlockStack>
                    </Box>
                  </Card>

                  {/* Fallback text color */}
                  <ColorField
                    label="Default text color"
                    value={textColor}
                    onChange={setTextColor}
                  />
                </BlockStack>
              </Box>
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* RIGHT: Live Preview */}
        <Layout.Section variant="oneThird">
          <BlockStack gap="300">
            <InlineStack gap="200" align="center">
              <Text as="h1" variant="headingSm" tone="subdued">
                <strong>Live preview</strong>
              </Text>
            </InlineStack>

            <Card>
              <Box padding="300">
                {/* ⬇️ Scrollable wrapper added; rest content unchanged */}
                <Scrollable style={{ maxHeight: 520 }} focusable shadow>
                  <BlockStack gap="300">
                    {/* Heading + optional product image placeholder */}
                    <BlockStack gap="150">
                      <Text as="h2" variant="headingSm" tone="subdued">
                        {offerPlacement.includes("above")
                          ? "Offers (above Buy Button)"
                          : "Offers"}
                      </Text>
                      {!hideProductImage ? (
                        <Box
                          padding="100"
                          borderColor="border"
                          borderWidth="025"
                          borderStyle="solid"
                          borderRadius="200"
                        >
                          <Text tone="subdued" as="span" variant="bodySm">
                            Product image placeholder
                          </Text>
                        </Box>
                      ) : null}
                      <Text as="h3" variant="headingMd" tone="magic">
                        {offerName}
                      </Text>
                    </BlockStack>

                    {/* Unit selection preview by template */}
                    {renderPreviewLayout()}

                    {/* Totals */}
                    <Card>
                      <Box padding="300">
                        <BlockStack gap="150">
                          <InlineStack align="space-between">
                            <Text as="span">Subtotal</Text>
                            <Text as="span">{currency(subtotal)}</Text>
                          </InlineStack>
                          <InlineStack align="space-between">
                            <Text as="span">Discount</Text>
                            <Text as="span">
                              {discount > 0
                                ? `-${currency(discount)}`
                                : currency(0)}
                            </Text>
                          </InlineStack>
                          <InlineStack align="space-between">
                            <Text as="span">Shipping</Text>
                            <Text as="span">
                              {shipping === 0 ? "Free" : currency(shipping)}
                            </Text>
                          </InlineStack>
                          <Divider />
                          <InlineStack align="space-between">
                            <Text as="h2" variant="headingSm">
                              Total
                            </Text>
                            <Text as="h2" variant="headingSm">
                              {currency(total)}
                            </Text>
                          </InlineStack>
                        </BlockStack>
                      </Box>
                    </Card>

                    {/* Shipping */}
                    <Card>
                      <Box padding="300">
                        <BlockStack gap="200">
                          <Text as="h1" variant="headingSm">
                            Shipping Options
                          </Text>
                          <InlineStack align="space-between" blockAlign="center">
                            <RadioButton
                              label="Free Shipping"
                              checked
                              onChange={() => {}}
                            />
                            <Text as="h2">Free</Text>
                          </InlineStack>
                        </BlockStack>
                      </Box>
                    </Card>

                    {/* Customer form (preview) */}
                    <Card>
                      <Box padding="300">
                        <BlockStack gap="200">
                          <TextField
                            label="Name"
                            value={customer.name}
                            onChange={(v) =>
                              setCustomer({ ...customer, name: v })
                            }
                            autoComplete="off"
                          />
                          <TextField
                            label="Phone"
                            value={customer.phone}
                            onChange={(v) =>
                              setCustomer({ ...customer, phone: v })
                            }
                            autoComplete="off"
                          />
                          <TextField
                            label="Address"
                            value={customer.address}
                            onChange={(v) =>
                              setCustomer({ ...customer, address: v })
                            }
                            autoComplete="off"
                          />
                          <TextField
                            label="Region"
                            value={customer.region}
                            onChange={(v) =>
                              setCustomer({ ...customer, region: v })
                            }
                            autoComplete="off"
                          />
                          <Checkbox
                            label="Subscribe to stay updated with new products and offers!"
                            checked={subscribe}
                            onChange={setSubscribe}
                          />
                        </BlockStack>
                      </Box>
                    </Card>

                    <Button variant="primary" tone="success" fullWidth>
                      BUY IT NOW – {currency(total)}
                    </Button>
                  </BlockStack>
                </Scrollable>
              </Box>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
