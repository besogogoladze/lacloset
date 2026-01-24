import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Segmented, Select, Space, Typography, Input, Button } from "antd";
import React, { useEffect, useMemo, useState } from "react";

const { Text } = Typography;
const { Option } = Select;
const { Search } = Input;

function SortList({ items = [], onFilterChange }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(true);

  // 🔹 Get available months (YYYY-MM)
  const availableMonths = useMemo(() => {
    const months = new Set();

    items.forEach((item) => {
      const d = new Date(item.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.add(key);
    });

    return Array.from(months).sort((a, b) => new Date(b) - new Date(a));
  }, [items]);

  // 🔹 Filtered items (status + month + search)
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // status filter
        if (statusFilter === "sold" && item.status) return false;
        if (statusFilter === "available" && !item.status) return false;

        // month filter
        if (monthFilter !== "all") {
          const d = new Date(item.createdAt);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          if (key !== monthFilter) return false;
        }

        // search by name
        if (
          searchTerm &&
          !item.nom?.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return sortOrder ? dateB - dateA : dateA - dateB;
      });
  }, [items, statusFilter, monthFilter, searchTerm, sortOrder]);

  // 🔹 Monthly totals
  const totalPrice = filteredItems.reduce(
    (sum, item) => sum + (item.priceInLari || 0),
    0,
  );

  useEffect(() => {
    onFilterChange(filteredItems);
  }, [filteredItems, onFilterChange]);

  return (
    <Space className="mb-6 flex flex-wrap justify-between items-center w-full gap-4">
      <Space className="flex flex-wrap gap-3">
        <Segmented
          options={[
            { label: "All", value: "all" },
            { label: "Available", value: "available" },
            { label: "Sold", value: "sold" },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
        />

        <Select
          value={monthFilter}
          onChange={setMonthFilter}
          className="min-w-50"
        >
          <Option value="all">All Months</Option>
          {availableMonths.map((month) => (
            <Option key={month} value={month}>
              {new Date(month + "-01").toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </Option>
          ))}
        </Select>

        <Search
          placeholder="Search by name..."
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          className="min-w-50"
        />
        <Button onClick={() => setSortOrder(!sortOrder)}>
          Sort {sortOrder ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
        </Button>
      </Space>

      <Space>
        <Text strong>Total items: {filteredItems.length}</Text>
        <Text strong>Total sold: {totalPrice} ₾</Text>
      </Space>
    </Space>
  );
}

export default SortList;
