import React, { useEffect } from "react";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Empty,
  Skeleton,
  DatePicker,
} from "antd";
import { useItems } from "../services/hooks/useItems";
import { useUpdateItem } from "../services/hooks/useUpdateItem";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: items = [], isFetching: itemsLoading } = useItems();
  const currentItem = items.find((i) => i._id === id);

  const { mutate: updateItem, isPending } = useUpdateItem();
  const [form] = Form.useForm();

  useEffect(() => {
    if (currentItem) {
      form.setFieldsValue({
        buyer: currentItem.buyer,
        soldItem: currentItem.soldItem,
        description: currentItem.description,
        priceInEuros: currentItem.priceInEuros,
        priceInLari: currentItem.priceInLari,
        pricePayedByClient: currentItem.pricePayedByClient,
        priceOfTransport: currentItem.priceOfTransport,
        dealDate: currentItem.dealDate ? dayjs(currentItem.dealDate) : null,
      });
    }
  }, [currentItem, form]);

  const onFinish = (values) => {
    const payload = {
      buyer: values.buyer,
      soldItem: values.soldItem,
      description: values.description,
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

  if (!currentItem) {
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
          <Card className="rounded-xl bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-4">
              პროდუქტის ინფორმაცია
            </h3>

            <Form.Item
              label="მყიდველი"
              name="buyer"
              rules={[
                {
                  required: true,
                  message: "გთხოვთ შეიყვანოთ მყიდველის სახელი და გვარი",
                },
              ]}
            >
              <Input placeholder="მყიდველის სახელი და გვარი" />
            </Form.Item>

            <Form.Item
              label="გაყიდული ნივთი"
              name="soldItem"
              rules={[
                { required: true, message: "გთხოვთ შეიყვანოთ გაყიდული ნივთი" },
              ]}
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

          <div className="pt-4">
            <Button
              type="primary"
              htmlType="submit"
              disabled={isPending}
              block
              loading={isPending}
              className="h-11 text-base"
            >
              {isPending ? "განახლება..." : "პროდუქტის განახლება"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default EditItem;
