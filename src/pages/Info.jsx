import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Table,
  Modal,
  Form,
  DatePicker,
  Upload,
  message,
} from "antd";
import {
  PlusCircleIcon,
  DocumentIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import config from "../config";
const { Dragger } = Upload;

const Info = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("authToken");

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}api/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const docs = await res.json();

      const formatted = docs.map((doc, i) => ({
        key: i,
        name: doc.name,
        expiry: doc.end_date,
        file_path: doc.file_path, // Include the file URL
      }));

      setData(formatted);
    } catch (err) {
      message.error("Failed to load documents.");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (values) => {
    if (!file) {
      message.error("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("start_date", values.start_date.format("YYYY-MM-DD"));
    formData.append("end_date", values.end_date.format("YYYY-MM-DD"));
    formData.append("document", file);

    try {
      const res = await fetch(`${config.apiBaseUrl}api/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error();

      message.success("Document uploaded successfully!");
      form.resetFields();
      setFile(null);
      setIsModalVisible(false);
      fetchDocuments();
    } catch {
      message.error("Failed to upload document.");
    }
  };

  const columns = [
    {
      title: (
        <span className="flex items-center gap-1 font-semibold">
          <DocumentIcon className="w-4 h-4" />
          Document name
        </span>
      ),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: <span className="font-semibold">Expiry Date</span>,
      dataIndex: "expiry",
      key: "expiry",
      sorter: (a, b) =>
        new Date(a.expiry).getTime() - new Date(b.expiry).getTime(),
    },
  ];

  const filteredData = data.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:bg-gray-100 p-1 rounded-md text-gray-400">
          Home
        </Link>
        / <span className="text-gray-900">Info</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-800">Info</h1>
      <p className="text-gray-500 mb-4">All Center Docs</p>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search"
          className="w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          type="primary"
          className="flex items-center gap-2 bg-yellow-500 border-none"
          onClick={() => setIsModalVisible(true)}
        >
          <PlusCircleIcon className="w-4 h-4" />
          Add Document
        </Button>
      </div>

      <div className="border">
        <Table
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
              if (selectedRows.length > 0) {
                const doc = selectedRows[selectedRows.length - 1];
                if (doc.file_path) {
                  window.open(doc.file_path, "_blank");
                } else {
                  message.warning("No file available for this document.");
                }
              }
            },
          }}
          columns={columns}
          dataSource={filteredData}
          pagination={true}
          bordered={false}
        />
      </div>

      <Modal
        open={isModalVisible}
        title="Upload New Document"
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Upload"
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Form.Item
            name="name"
            label="Document Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>

          <div className="flex items-center justify-between gap-5">
            <Form.Item
              className="w-1/2"
              name="start_date"
              label="Start Date"
              rules={[{ required: true, message: "Select start date" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              className="w-1/2"
              name="end_date"
              label="End Date"
              rules={[{ required: true, message: "Select end date" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </div>

          <Form.Item label="Upload File" required>
            <Dragger
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              maxCount={1}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            >
              <p className="ant-upload-drag-icon">
                <InboxIcon className="w-8 h-8 mx-auto text-gray-400" />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Info;
