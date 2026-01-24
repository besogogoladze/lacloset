import React from "react";
import { useAddItems } from "../services/hooks/useAddItems";
import { Form, Input, InputNumber, Button, Card, Image } from "antd";
import errorImg from "../assets/No_Image_Available.jpg";

function AddItem() {
  const { mutate: addItem, isLoading } = useAddItems();
  const [form] = Form.useForm();

  const imageUrl = Form.useWatch("image_url", form);

  const onFinish = (values) => {
    addItem({
      ...values,
      status: true,
    });

    form.resetFields();
  };

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-3xl rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          ➕ Add New Product
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
              Product information
            </h3>

            <Form.Item
              label="Name"
              name="nom"
              rules={[{ required: true, message: "Please enter item name" }]}
            >
              <Input placeholder="Enter item name" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter item description"
                className="resize-none"
              />
            </Form.Item>
          </Card>

          {/* Pricing & size */}
          <Card className="rounded-xl bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-4">Pricing & size</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                label="Price (€)"
                name="price"
                rules={[{ required: true, message: "Enter price" }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="Price (₾)"
                name="priceInLari"
                rules={[
                  { required: true, message: "Price in Lari is required" },
                ]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="Size"
                name="size"
                rules={[{ required: true, message: "Enter size" }]}
              >
                <Input placeholder="M, L, XL..." />
              </Form.Item>
            </div>
          </Card>

          {/* Image */}
          <Card className="rounded-xl bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-4">Product image</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <Form.Item
                label="Image URL"
                name="image_url"
                rules={[{ required: true, message: "Enter image URL" }]}
              >
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item>

              <div className="flex justify-center">
                <Image
                  src={imageUrl || errorImg}
                  fallback={errorImg}
                  alt="Preview"
                  className="rounded-xl object-contain max-h-48"
                />
              </div>
            </div>
          </Card>

          {/* Action */}
          <div className="pt-4">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="h-11 text-base"
            >
              {isLoading ? "Adding..." : "Add Item"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default AddItem;
