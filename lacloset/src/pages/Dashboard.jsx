import { useEffect, useState } from "react";
import { Card, Tag, Button, Skeleton, Empty, Popconfirm, Image } from "antd";
import { useItems } from "../services/hooks/useItems";
import SortList from "../components/SortList";
import { Link } from "react-router";
import { useDeleteItems } from "../services/hooks/useDeleteItems";
import { useUpdateItemStatus } from "../services/hooks/useUpdateItemStatus";
import altImg from "../assets/No_Image_Available.jpg";
import { calculateProfitPercent } from "../utils/convertEuroToLari";

function Dashboard() {
  const { data: items = [], isLoading } = useItems();
  const [filteredItems, setFilteredItems] = useState([]);
  const [profits, setProfits] = useState({});
  const { mutate: deleteItem, isLoading: deleteLoading } = useDeleteItems();
  const updateItemStatus = useUpdateItemStatus();

  useEffect(() => {
    const fetchProfits = async () => {
      const results = {};
      for (const item of items) {
        try {
          results[item._id] = await calculateProfitPercent(
            item.price,
            item.priceInLari,
          );
        } catch {
          results[item._id] = 0;
        }
      }
      setProfits(results);
    };

    fetchProfits();
  }, [items]);

  if (isLoading) {
    return (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} active className="rounded-2xl" />
        ))}
      </div>
    );
  }

  const handleDelete = (item) => deleteItem(item._id);
  const handleComplete = (item) =>
    updateItemStatus.mutate({ id: item._id, status: !item.status });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-semibold text-gray-800">🛒 Products</h1>

        <Link
          to="/add-item"
          className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-5 py-2.5 text-white font-medium hover:bg-blue-600 transition"
        >
          + Add item
        </Link>
      </div>

      <SortList items={items} onFilterChange={setFilteredItems} />

      {/* Content */}
      {filteredItems.length === 0 ? (
        <Card className="rounded-2xl shadow-sm">
          <Empty description="No products found" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item._id}
              className="max-w-96 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
              bodyStyle={{ padding: 20 }}
            >
              {/* Title */}
              <h2 className="max-[460px]:text-center text-lg font-semibold mb-3 truncate">
                {item.nom}
              </h2>

              {/* Image */}
              <div className="flex justify-center mb-4">
                <Image
                  src={item.image_url || altImg}
                  alt={item.nom}
                  fallback={altImg}
                  className="rounded-xl object-contain max-h-48"
                  preview={{ mask: "Click to zoom" }}
                />
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 wrap-break-word">
                  {item.description}
                </p>

                <div className="flex justify-between">
                  <span className="text-gray-500">Size</span>
                  <span className="font-medium">{item.size}</span>
                </div>

                <div className="border-t pt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span>{item.price}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price (₾)</span>
                    <span>{item.priceInLari}₾</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Profit</span>
                    <span>
                      {profits[item._id] !== undefined
                        ? profits[item._id].toFixed(2)
                        : "xxx"}
                      ₾
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-gray-500">Status</span>
                  <Tag color={item.status ? "green" : "red"}>
                    {item.status ? "Available" : "Sold"}
                  </Tag>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="primary"
                  className="flex-1"
                  onClick={() => handleComplete(item)}
                >
                  {item.status ? "Mark Sold" : "Mark Available"}
                </Button>

                <Popconfirm
                  title={`Delete "${item.nom}"?`}
                  onConfirm={() => handleDelete(item)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger loading={deleteLoading}>
                    Delete
                  </Button>
                </Popconfirm>

                <Button type="link" className="px-0">
                  <Link to={`./edit/${item._id}`}>Edit</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
