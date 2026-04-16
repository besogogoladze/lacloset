import React from "react";
import { useAddItems } from "../services/hooks/useAddItems";
import { Form, Input, InputNumber, Button, Card, DatePicker } from "antd";
import { useNavigate } from "react-router";

function AddItem() {
  const { mutate: addItem, isPending } = useAddItems();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    const payload = {
      ...values,
      priceInEuros: Math.round((values.priceInEuros || 0) * 100) / 100,
      priceInLari: Math.round((values.priceInLari || 0) * 100) / 100,
      pricePayedByClient:
        Math.round((values.pricePayedByClient || 0) * 100) / 100,
      priceOfTransport: Math.round((values.priceOfTransport || 0) * 100) / 100,
      totalProfit:
        Math.round(
          ((values.pricePayedByClient || 0) -
            ((values.priceOfTransport || 0) + (values.priceInLari || 0))) *
            100,
        ) / 100,
      dealDate: values.dealDate ? values.dealDate.toISOString() : null,
    };

    addItem(payload, {
      onSuccess: () => {
        form.resetFields();
        navigate("/dashboard");
      },
    });
  };

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-3xl rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          ➕ ინფორმაციის დამატება
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="space-y-6"
        >
          <Card className="rounded-xl bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-4">
              პროდუქტის ინფორმაცია
            </h3>

            <Form.Item
              label="მყიდველი"
              name="buyer"
              rules={[{ required: true, message: "Please enter buyer name" }]}
            >
              <Input placeholder="მყიდველის სახელი და გვარი" />
            </Form.Item>

            <Form.Item
              label="გაყიდული ნივთი"
              name="soldItem"
              rules={[{ required: true, message: "Please enter sold item" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="შეიყვანეთ გაყიდული ნივთის დეტალები"
                className="resize-none"
              />
            </Form.Item>

            <Form.Item label="დამატებითი ინფორმაცია" name="description">
              <Input.TextArea
                rows={4}
                placeholder="შეიყვანეთ დამატებითი ინფორმაცია (არასავალდებულო)"
                className="resize-none"
              />
            </Form.Item>

            <Form.Item label="თარიღი" name="dealDate">
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
          </Card>

          <Card className="rounded-xl bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-4">ფასები</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                label="ნივთის ღირებულება (€)"
                name="priceInEuros"
                rules={[
                  { required: true, message: "Price in Euros is required" },
                ]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="ნივთის ღირებულება (₾)"
                name="priceInLari"
                rules={[
                  { required: true, message: "Price in Lari is required" },
                ]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="დარიცხული თანხა (₾)"
                name="pricePayedByClient"
                rules={[
                  {
                    required: true,
                    message: "Price payed by client is required",
                  },
                ]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="გზავნილის ღირებულება (₾)"
                name="priceOfTransport"
                rules={[
                  { required: true, message: "Price of transport is required" },
                ]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </div>
          </Card>

          <div className="pt-4">
            <Button
              type="primary"
              htmlType="submit"
              disabled={isPending}
              loading={isPending}
              block
              className="h-11 text-base"
            >
              {isPending ? "დამატება..." : "პროდუქტის დამატება"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default AddItem;
