import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Card,
  Image,
  Empty,
  Skeleton,
} from "antd";
import { useItems } from "../services/hooks/useItems";
import { useUpdateItem } from "../services/hooks/useUpdateItem";
import errorImg from "../assets/No_Image_Available.jpg";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: items = [], isLoading: itemsLoading } = useItems();
  const item = items.find((i) => i._id === id);

  const { mutate: updateItem, isLoading } = useUpdateItem();
  const [form] = Form.useForm();

  const imageUrl = Form.useWatch("image_url", form);

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        nom: item.nom,
        description: item.description,
        price: item.price,
        priceInLari: item.priceInLari,
        size: item.size,
        image_url: item.image_url,
        status: item.status,
      });
    }
  }, [item, form]);

  const onFinish = (values) => {
    updateItem(
      { id, payload: values },
      {
        onSuccess: () => navigate("/dashboard"),
      },
    );
  };

  if (itemsLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Skeleton active paragraph={{ rows: 8 }} />
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
          ✏️ Edit Product
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="space-y-6"
        >
          {/* Basic info */}
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

          {/* Status */}
          <Card className="rounded-xl bg-gray-50">
            <Form.Item
              label="Availability"
              name="status"
              valuePropName="checked"
              className="mb-0"
            >
              <Switch checkedChildren="Available" unCheckedChildren="Sold" />
            </Form.Item>
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
              {isLoading ? "Updating..." : "Update Item"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default EditItem;
