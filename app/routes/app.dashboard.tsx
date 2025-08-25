import {
  Box,
  Card,
  Page,
  InlineStack,
  InlineGrid,
  Text,
  ResourceList,
  Badge,
  Button,
  BlockStack,
  Icon,
} from "@shopify/polaris";
import { CashDollarIcon, ShieldPersonIcon, ArrowDiagonalIcon, OrderIcon, ViewIcon, AlertTriangleIcon, StatusActiveIcon } from '@shopify/polaris-icons';
import { TitleBar } from "@shopify/app-bridge-react";

export default function Dashboard() {
  return (
    <Page>
      <TitleBar title="Dashboard" />
      <Box padding="400">
        <Text variant="headingXl" as="h1">
          Dashboard
        </Text>
        <Text variant="bodyMd" as="p" tone="subdued">
          Welcome back! Here's what's happening with your COD orders today.
        </Text>
      </Box>

      <InlineGrid columns={{ xs: 1, sm: 2, md: 4 }} gap="400">

        <Card>
          <InlineStack align="space-between">
            <Text as="h3" variant="headingSm">
              Today's Orders
            </Text>
            <Icon source={OrderIcon} tone="base" />
          </InlineStack>
          <Text as="h2" variant="heading2xl">
            47
          </Text>
          <Text as="p" tone="subdued">
            from yesterday
            <Text as="span" tone="success">
              +12%
            </Text>
          </Text>
        </Card>

        <Card>
          <InlineStack align="space-between">
            <Text as="h3" variant="headingSm">
              Conversion Rate
            </Text>
            <Icon source={ArrowDiagonalIcon} tone="base" />
          </InlineStack>
          <Text as="h2" variant="heading2xl">
            68.5%
          </Text>
          <Text as="p" tone="subdued">
            from last week{" "}
            <Text as="span" tone="success">
              +3.2%
            </Text>
          </Text>
        </Card>

        <Card>
          <InlineStack align="space-between">
            <Text as="h3" variant="headingSm">
              Revenue Today
            </Text>
            <Icon source={CashDollarIcon} tone="base" />
          </InlineStack>

          <Text as="h2" variant="heading2xl">
            $8,547
          </Text>
          <Text as="p" tone="subdued">
            from yesterday{" "}
            <Text as="span" tone="success">
              +8.1%
            </Text>
          </Text>
        </Card>

        <Card>
          <InlineStack align="space-between">
            <Text as="h3" variant="headingSm">
              Fraud Alerts
            </Text>
            <Icon source={ShieldPersonIcon} tone="base" />
          </InlineStack>
          <Text as="h2" variant="heading2xl">
            2
          </Text>
          <Text as="p" tone="subdued">requires attention</Text>
        </Card>
      </InlineGrid>

      <Box paddingBlockStart="600">
        <InlineGrid columns={{ xs: 1, sm: 2 }} gap="400">
          <Card>
            <Box padding="400">
              <InlineStack align="space-between" blockAlign="center">
                <Box>
                  <Text variant="headingXl" as="h1">
                    Recent Orders
                  </Text>
                  <Text as="p" variant="bodySm">
                    Latest COD orders from your store
                  </Text>
                </Box>
                <Button icon={ViewIcon}>View All</Button>
              </InlineStack>
            </Box>
            <ResourceList
              resourceName={{ singular: 'order', plural: 'orders' }}
              items={[
                {
                  id: '#COD-1234',
                  name: 'Sarah Johnson',
                  product: 'Premium Skincare Set',
                  price: '$149.99',
                  time: '2 mins ago',
                  status: 'confirmed',
                },
                {
                  id: '#COD-1235',
                  name: 'Mike Chen',
                  product: 'Wireless Earbuds Pro',
                  price: '$89.99',
                  time: '5 mins ago',
                  status: 'pending',
                },
                {
                  id: '#COD-1236',
                  name: 'Emma Davis',
                  product: 'Smart Watch Bundle',
                  price: '$299.99',
                  time: '12 mins ago',
                  status: 'verified',
                },
                {
                  id: '#COD-1237',
                  name: 'John Smith',
                  product: 'Gaming Headset',
                  price: '$129.99',
                  time: '18 mins ago',
                  status: 'fraud',
                },
              ]}
              renderItem={(item) => {
                const { id, name, product, price, time, status } = item;

                let statuss = {
                  confirmed: { tone: 'success', text: 'Confirmed' },
                  pending: { tone: 'info', text: 'Pending' },
                  verified: { tone: 'attention', text: 'Verified' },
                  fraud: { tone: 'critical', text: 'Fraud Alert' },
                }[status];

                return (
                  <Box paddingBlockEnd="600">
                    <Card>
                      <Box>
                        <InlineStack align="space-between">
                          <InlineStack gap="200" blockAlign="center">
                            <Text as="p" variant="bodyMd" fontWeight="bold">
                              {id}
                            </Text>
                            <Badge
                              tone={statuss?.tone === "status" ? "critical" : "info"}
                            >
                              {statuss?.text}
                            </Badge>
                          </InlineStack>
                          <Box>
                            <Text as="p" variant="bodyMd" fontWeight="bold">{price}</Text>
                            <Text tone="subdued" as="p" variant="bodySm">
                              {time}
                            </Text>
                          </Box>
                        </InlineStack>
                        <Text as="p" variant="bodyMd" >{name}</Text>
                        <Text fontWeight="semibold" as="p" variant="bodyMd">{product}</Text>
                      </Box>
                    </Card>
                  </Box>
                );
              }}
            />
          </Card>

          <Card>
            <Box padding="400">
              <InlineStack gap="200" blockAlign="center">
                <Text variant="headingXl" as="h1">
                  Fraud Alerts
                </Text>
                <Icon source={AlertTriangleIcon} tone="base" />
              </InlineStack>
              <Text as="p" variant="bodySm">Orders requiring manual review</Text>
            </Box>

            <ResourceList
              resourceName={{ singular: 'alert', plural: 'alerts' }}
              items={[
                {
                  id: '#COD-1237',
                  reason: 'Multiple orders from same IP',
                  risk: 'high',
                },
                {
                  id: '#COD-1224',
                  reason: 'Unusual delivery address',
                  risk: 'medium',
                },
              ]}
              renderItem={(item) => {
                const { id, reason, risk } = item;

                const riskLabel = {
                  high: 'High Risk',
                  medium: 'Medium Risk',
                }[risk];

                return (
                  <Box paddingBlockEnd="600">
                    <Card>
                      <Box>
                        <InlineStack align="space-between">
                          <Text as="p" variant="bodyMd" fontWeight="bold">{id}</Text>
                          <Badge tone={riskLabel === "High Risk" ? "critical" : undefined}>
                            {riskLabel}
                          </Badge>
                        </InlineStack>

                        <Text tone="subdued" as="p">{reason}</Text>

                        <InlineStack gap="400">
                          <Button icon={StatusActiveIcon} size="large" variant="secondary">Approve</Button>
                          <Button size="large" tone="critical" variant="primary">Block</Button>
                        </InlineStack>
                      </Box>
                    </Card>
                  </Box>
                );
              }}
            />
            <Box padding="400" borderBlockStartWidth="025" borderColor="border">
              <Button fullWidth variant="primary" tone="success">View All Alerts</Button>
            </Box>
          </Card>
        </InlineGrid>
      </Box>

      <Box paddingBlockStart="600">
        <InlineGrid columns={1} gap="400">
          <Card>
            <Box padding="600">
              <BlockStack gap="200">
                <Text variant="headingLg" as="h2">
                  Quick Actions
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Common tasks to manage your COD forms
                </Text>
              </BlockStack>
            </Box>

            <Box padding="400">
              <InlineGrid columns={3} gap="400">
                <Button fullWidth variant="primary" tone="success" size="large">
                  <BlockStack align="center" gap="200">
                    <Icon source={OrderIcon} />
                    <Text as="span">Create New Form</Text>
                  </BlockStack>
                </Button>

                <Button fullWidth variant="primary" tone="success" size="large">
                  <BlockStack align="center" gap="200">
                    <Icon source={ArrowDiagonalIcon} />
                    <Text as="span">Add Upsell Offer</Text>
                  </BlockStack>
                </Button>

                <Button fullWidth variant="primary" tone="success" size="large">
                  <BlockStack align="center" gap="200">
                    <Icon source={ShieldPersonIcon} />
                    <Text as="span">Review Security</Text>
                  </BlockStack>
                </Button>
              </InlineGrid>
            </Box>
          </Card>
        </InlineGrid>
      </Box>
    </Page>
  );
}