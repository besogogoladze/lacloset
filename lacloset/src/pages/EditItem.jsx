import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, InputNumber, Button, Card, Empty, Skeleton } from "antd";
import { useItems } from "../services/hooks/useItems";
import { useUpdateItem } from "../services/hooks/useUpdateItem";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: items = [], isLoading: itemsLoading } = useItems();
  const item = items.find((i) => i._id === id);

  const { mutate: updateItem, isLoading } = useUpdateItem();
  const [form] = Form.useForm();

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        buyer: item.buyer,
        soldItem: item.soldItem,
        description: item.description,
        priceInEuros: item.priceInEuros,
        priceInLari: item.priceInLari,
        pricePayedByClient: item.pricePayedByClient,
        priceOfTransport: item.priceOfTransport,
      });
    }
  }, [item, form]);

  const onFinish = (values) => {
    // Compute totalProfit
    const payload = {
      ...values,
      totalProfit:
        values.pricePayedByClient -
        (values.priceInLari + values.priceOfTransport),
    };

    updateItem(
      { id, payload },
      {
        onSuccess: () => navigate("/dashboard"),
      },
    );
  };

  if (itemsLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <Card className="rounded-2xl shadow-sm">
          <Empty description="Item not found" />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-3xl rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          ✏️ ინფორმაციის რედაქტირება
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="space-y-6"
        >
          {/* Product info */}
          <Card className="rounded-xl bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-4">
              პროდუქტის ინფორმაცია
            </h3>

            <Form.Item
              label="მყიდველი"
              name="buyer"
              rules={[{ required: true, message: "გთხოვთ შეიყვანოთ მყიდველის სახელი და გვარი" }]}
            >
              <Input placeholder="მყიდველის სახელი და გვარი" />
            </Form.Item>

            <Form.Item
              label="გაყიდული ნივთი"
              name="soldItem"
              rules={[{ required: true, message: "გთხოვთ შეიყვანოთ გაყიდული ნივთი" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="შეიყვანეთ გაყიდული ნივთის დეტალები"
                className="resize-none"
              />
            </Form.Item>

            <Form.Item
              label="დამატებითი ინფორმაცია"
              name="description"
              rules={[{ required: false }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="შეიყვანეთ დამატებითი ინფორმაცია (არასავალდებულო)"
                className="resize-none"
              />
            </Form.Item>
          </Card>

          {/* Pricing */}
          <Card className="rounded-xl bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-4">ფასები</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Form.Item
                label="ნივთის ღირებულება (€)"
                name="priceInEuros"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="ნივთის ღირებულება (₾)"
                name="priceInLari"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="დარიცხული თანხა (₾)"
                name="pricePayedByClient"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="გზავნილის ღირებულება (₾)"
                name="priceOfTransport"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </div>
          </Card>

          {/* Actions */}
          <div className="pt-4">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="h-11 text-base"
            >
              {isLoading ? "განახლება..." : "პროდუქტის განახლება"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default EditItem;
