import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  Button,
  Badge,
  InlineGrid,
  InlineStack,
  Checkbox,
  TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { Form } from "@remix-run/react";
import { Eye, Save } from "lucide-react";




export default function UpsellPage() {
  const [upsellEnabled, setUpsellEnabled] = useState(true);
  const [quantityDiscount, setQuantityDiscount] = useState(true);
  const [freeGift, setFreeGift] = useState(false);

  

  return (
    <Page>
      <TitleBar title="Upsells & Offers" />
      <Card>
      

      <Layout>
        {/* Left Section */}
        <Layout.Section>
          <Form method="post">
            <BlockStack gap="400">
              {/* Product Upsells */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingMd">
                      Product Upsells
                    </Text>
                    <Checkbox
                      label="Enable"
                      checked={upsellEnabled}
                      onChange={setUpsellEnabled}
                    />
                  </InlineStack>

                  {upsellEnabled && (
                    <BlockStack gap="300">
                      <Card>
                        <InlineStack align="space-between">
                          <Text as="h2">Premium Phone Case - $29.99</Text>
                          <Badge tone="success">Active</Badge>
                        </InlineStack>
                      </Card>
                      <Card>
                        <InlineStack align="space-between">
                          <Text as="h2">Screen Protector - $14.99</Text>
                          <Badge>Inactive</Badge>
                        </InlineStack>
                      </Card>
                      <Button variant="primary" tone="success">Add Upsell Product</Button>
                    </BlockStack>
                  )}
                </BlockStack>
              </Card>

              {/* Quantity Discounts */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingMd">
                      Quantity Discounts
                    </Text>
                    <Checkbox
                      label="Enable"
                      checked={quantityDiscount}
                      onChange={setQuantityDiscount}
                    />
                  </InlineStack>

                  {quantityDiscount && (
                    <BlockStack gap="200">
                      <InlineGrid columns={3} gap="200">
                        <Text as="p">2+</Text>
                        <Text as="p">10% Off</Text>
                        <Badge tone="success">Active</Badge>
                      </InlineGrid>

                      <InlineGrid columns={3} gap="200">
                        <Text as="p">5+</Text>
                        <Text as="p">20% Off</Text>
                        <Badge tone="success">Active</Badge>
                      </InlineGrid>

                      <Button variant="primary" tone="success">Add Discount Tier</Button>
                    </BlockStack>
                  )}
                </BlockStack>
              </Card>

              {/* Free Gift */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingMd">
                      Free Gift
                    </Text>
                    <Checkbox
                      label="Enable"
                      checked={freeGift}
                      onChange={setFreeGift}
                    />
                  </InlineStack>

                  {freeGift && (
                    <BlockStack gap="300">
                      <TextField
                        label="Minimum Order Value"
                        value="$50.00"
                        onChange={() => {}}
                        autoComplete="off"
                      />
                      <TextField
                        label="Gift Product"
                        value="Free Mug"
                        onChange={() => {}}
                        autoComplete="off"
                      />
                    </BlockStack>
                  )}
                </BlockStack>
              </Card>
            </BlockStack>
          </Form>
        </Layout.Section>

       
              
            

        
        
      {/* Right Section - Preview */}
      {/* Right Section - Buttons + Preview together */}
        <Layout.Section variant="oneThird">
          <BlockStack gap="300">
            {/* ✅ Buttons Row */}
            <InlineStack align="start" gap="800">
              <Button icon={<Eye />} variant="primary" tone="success" size="large" >
                Preview Page
              </Button>
              <Button icon={<Save />}  submit  variant="primary">
                Save Changes
              </Button>
            </InlineStack>

            {/* ✅ Preview Card */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm">
                  Upsell Preview
                </Text>

                {upsellEnabled && (
                  <Card>
                    <BlockStack gap="200">
                      <Text as="h3">🔥 Premium Phone Case - Only $29.99</Text>
                      <Button variant="primary" tone="success">Add</Button>
                    </BlockStack>
                  </Card>
                )}

                {quantityDiscount && (
                  <Card>
                    <Text as="h3">🎉 Buy 2+ and save 10%!</Text>
                  </Card>
                )}

                {freeGift && (
                  <Card>
                    <Text as="h3">🎁 Free gift with orders over $50!</Text>
                  </Card>
                )}
              </BlockStack>
            </Card>
            <InlineStack align="start" gap="300">
              <Button  tone="success"   >
                Continue Shopping
              </Button>
              <Button  submit  variant="primary" tone="success">
                Complete Order
              </Button>
            </InlineStack>
          </BlockStack>
        </Layout.Section>
        
      </Layout>
      </Card>
    </Page>
  );
}
