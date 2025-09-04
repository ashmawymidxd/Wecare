import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Typography, Empty } from "antd";
import {
  InformationCircleIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  BoltIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import config from "../config"
import NotificationCard from "../components/Notifications/NotificationCard";

const { Title, Text } = Typography;
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${config.apiBaseUrl}api/employee/notifications/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "App\\Notifications\\NewContractCreated":
        return <DocumentTextIcon className="w-6 h-6 text-blue-600" />;
      case "App\\Notifications\\ActionRequired":
        return <BoltIcon className="w-6 h-6 text-red-600" />;
      case "App\\Notifications\\PaymentContract":
        return <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />;
      case "App\\Notifications\\Clearancedocuments":
        return (
          <ClipboardDocumentCheckIcon className="w-6 h-6 text-green-600" />
        );
      default:
        return <InformationCircleIcon className="w-6 h-6 text-gray-600" />;
    }
  };

  const getNotificationBgColor = (notificationType) => {
    return notificationType === "warning" ? "#faf1e0" : "#FCFCFC";
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch(
        `${config.apiBaseUrl}api/employee/notifications/${id}/mark-as-read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state to reflect read status
      setNotifications(
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, read_at: new Date().toISOString() }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch(
        `${config.apiBaseUrl}api/employee/notifications/mark-all-as-read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update all notifications to read
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          read_at: notification.read_at || new Date().toISOString(),
        }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-5">
        <div className="mb-6">
          <Title
            level={2}
            className="text-xl md:text-2xl mt-4 mb-1 font-semibold text-gray-800"
          >
            Notifications
          </Title>
          <Text type="secondary" className="text-sm">
            Loading your notifications...
          </Text>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 rounded p-4 h-20"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-5">
        <div className="mb-6">
          <div className="text-sm text-gray-500">
            <Link
              to="/"
              className="hover:bg-gray-100 p-1 rounded-md text-gray-400"
            >
              Home
            </Link>
            / <span className="text-gray-900">Notifications</span>
          </div>
          <Title
            level={2}
            className="text-xl md:text-2xl mt-4 mb-1 font-semibold text-gray-800"
          >
            Notifications
          </Title>
          <Text type="secondary" className="text-sm">
            Error loading notifications
          </Text>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const formattedNotifications = notifications.map((notification) => ({
    id: notification.id,
    icon: getNotificationIcon(notification.type),
    title: notification.data.message,
    date: new Date(notification.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    type: notification.data.type,
    bgColor: getNotificationBgColor(notification.data.type),
    read: !!notification.read_at,
    actionUrl: notification.data.action_url,
  }));

  return (
    <div className="p-4 md:p-5">
      {/* Header */}
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:bg-gray-100 p-1 rounded-md text-gray-400">
          Home
        </Link>
        / <span className="text-gray-900">Notifications</span>
      </div>
      <div className="mb-6 flex justify-between items-center">
        <div className="">
          <Title
            level={2}
            className="text-xl md:text-2xl mt-4 mb-1 font-semibold text-gray-800"
          >
            Notifications
          </Title>
          <Text type="secondary" className="text-sm">
            Take a look on your notifications
          </Text>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="mt-2 text-sm text-yellow-600 hover:text-yellow-800 font-medium border rounded-lg py-1 px-3"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {formattedNotifications.length === 0 ? (
          <Empty
            description="No notifications found"
            className="py-8"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          formattedNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => {
                markAsRead(notification.id);
                if (notification.actionUrl) {
                  window.location.href = notification.actionUrl;
                }
              }}
              className="cursor-pointer"
            >
              <NotificationCard
                {...notification}
                style={{ backgroundColor: notification.bgColor }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
