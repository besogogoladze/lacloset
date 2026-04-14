import { useMemo } from "react";
import { Table, Space, Button, Popconfirm, Card, Empty, Input } from "antd";
import { useItems } from "../services/hooks/useItems";
import { Link } from "react-router";
import { useDeleteItems } from "../services/hooks/useDeleteItems";

const { Search } = Input;

function Dashboard() {
  const { data: items = [], isLoading } = useItems();
  const { mutate: deleteItem, isLoading: deleteLoading } = useDeleteItems();

  // ✅ Add profit + month key to data
  const dataWithComputed = useMemo(() => {
    return [...items]
      .map((item) => {
        const d = new Date(item.createdAt);
        const monthKey = `${d.getFullYear()}-${String(
          d.getMonth() + 1,
        ).padStart(2, "0")}`;

        return {
          ...item,
          totalProfit: item.totalProfit,
          monthKey,
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [items]);

  const handleDelete = (item) => deleteItem(item._id);

  const monthFilters = useMemo(() => {
    const unique = [...new Set(dataWithComputed.map((i) => i.monthKey))].filter(
      (m) => m !== "unknown",
    );

    return unique.map((m) => ({
      text: new Date(`${m}-01`).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      }),
      value: m,
    }));
  }, [dataWithComputed]);

  const columns = [
    {
      title: "თარიღი",
      dataIndex: "dealDate",
      filters: monthFilters,
      onFilter: (value, record) => record.monthKey === value,
      render: (_, record) => {
        const date = record.dealDate || record.createdAt;

        return new Date(date).toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
          day: "numeric",
        });
      },
    },
    {
      title: "მყიდველი",
      dataIndex: "buyer",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div className="p-2">
          <Search
            placeholder="Search buyer"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onSearch={confirm}
            allowClear
          />
        </div>
      ),
      onFilter: (value, record) =>
        record.buyer?.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "მოგება (₾)",
      dataIndex: "totalProfit",
      sorter: (a, b) => (a.totalProfit || 0) - (b.totalProfit || 0),
      render: (profit) => (
        <span
          className={`font-semibold ${
            (profit || 0) >= 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {(profit || 0).toFixed(2)}
        </span>
      ),
    },
    {
      title: "გაყიდული ნივთი",
      dataIndex: "soldItem",
      render: (text) => (
        <div className="whitespace-normal wrap-break-word max-w-52">{text}</div>
      ),
    },
    {
      title: "დამატებითი ინფორმაცია",
      dataIndex: "description",
      render: (text) => (
        <div className="whitespace-normal wrap-break-word max-w-52">
          {text || "-"}
        </div>
      ),
    },
    {
      title: "ნივთის ღირებულება (€)",
      dataIndex: "priceInEuros",
      sorter: (a, b) => a.priceInEuros - b.priceInEuros,
      render: (value) => (value || 0).toFixed(2),
    },
    {
      title: "ნივთის ღირებულება (₾)",
      dataIndex: "priceInLari",
      sorter: (a, b) => a.priceInLari - b.priceInLari,
      render: (value) => (value || 0).toFixed(2),
    },
    {
      title: "დარიცხული თანხა (₾)",
      dataIndex: "pricePayedByClient",
      render: (value) => (value || 0).toFixed(2),
    },
    {
      title: "გზავნილის ღირებულება (₾)",
      dataIndex: "priceOfTransport",
      render: (value) => (value || 0).toFixed(2),
    },
    {
      title: "მოქმედებები",
      render: (_, record) => (
        <Space>
          <Link to={`./edit/${record._id}`}>
            <Button type="primary">Edit</Button>
          </Link>

          <Popconfirm
            title={`Delete "${record.buyer}"?`}
            onConfirm={() => handleDelete(record)}
          >
            <Button danger loading={deleteLoading}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const monthlyProfitData = Object.values(
    dataWithComputed.reduce((acc, item) => {
      if (item.monthKey === "unknown") return acc;

      if (!acc[item.monthKey]) {
        acc[item.monthKey] = {
          monthKey: item.monthKey,
          totalProfit: 0,
        };
      }

      acc[item.monthKey].totalProfit += item.totalProfit || 0;
      return acc;
    }, {}),
  ).sort((a, b) => new Date(`${b.monthKey}-01`) - new Date(`${a.monthKey}-01`));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">🛒 ინფორმაცია</h1>

        <Link
          to="/add-item"
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          + დამატება
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">მოგება თვეების მიხედვით</h2>
        <div className="bg-white p-4 rounded-2xl shadow">
          {dataWithComputed.length === 0 ? (
            <Card>
              <Empty description="პროდუქტების სია ცარიელია" />
            </Card>
          ) : (
            <Table
              columns={[
                {
                  title: "თვე",
                  dataIndex: "monthKey",
                  render: (monthKey) =>
                    new Date(`${monthKey}-01`).toLocaleDateString(undefined, {
                      month: "long",
                      year: "numeric",
                    }),
                },
                {
                  title: "მოგება (₾)",
                  dataIndex: "totalProfit",
                  render: (profit) => (
                    <span
                      className={`font-semibold ${
                        (profit || 0) >= 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {(profit || 0).toFixed(2)}
                    </span>
                  ),
                },
              ]}
              dataSource={monthlyProfitData}
              rowKey="monthKey"
              pagination={{ pageSize: 3 }}
            />
          )}
        </div>
      </div>

      {dataWithComputed.length === 0 ? (
        <Card>
          <Empty description="პროდუქტების სია ცარიელია" />
        </Card>
      ) : (
        <div className="bg-white p-4 rounded-2xl shadow">
          <Table
            columns={columns}
            dataSource={dataWithComputed}
            rowKey="_id"
            loading={isLoading}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 900 }}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
