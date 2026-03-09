import Header from "@/src/components/Header";
import ScreenBackground from "@/src/components/ScreenBackground";
import { theme } from "@/src/constants/theme";
import { notificationAPI } from "@/src/services/api";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data.count);
      console.log("Unread count:", response.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      // Update all notifications to read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
    fetchUnreadCount();
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification,
      ]}
      onPress={() => !item.isRead && handleMarkAsRead(item._id)}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationDate}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ScreenBackground>
        <Header title="Notifications" showBack />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <Header title="Notifications" showBack />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            style={styles.markAllButton}
          >
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySubTitle}>
                Updates about your orders and account will appear here.
              </Text>
            </View>
          }
        />

        {unreadCount > 0 && (
          <View style={styles.unreadCountBadge}>
            <Text style={styles.unreadCountText}>{unreadCount} unread</Text>
          </View>
        )}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 26,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: "rgba(23,33,43,0.66)",
    borderWidth: 1,
    borderColor: "rgba(160,196,255,0.16)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(160,196,255,0.12)",
  },
  markAllButton: {
    padding: 5,
  },
  markAllText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 26,
  },
  notificationItem: {
    backgroundColor: "rgba(23,33,43,0.72)",
    padding: 15,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(160,196,255,0.16)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(160,196,255,0.1)",
    flexDirection: "row",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  unreadNotification: {
    backgroundColor: "rgba(34,48,64,0.88)",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: theme.colors.onSurface,
  },
  notificationMessage: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 5,
    lineHeight: 20,
  },
  notificationDate: {
    fontSize: 12,
    color: "#7f95ab",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    marginLeft: 10,
  },
  unreadCountBadge: {
    position: "absolute",
    bottom: 26,
    right: 20,
    backgroundColor: "rgba(46,166,255,0.94)",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  unreadCountText: {
    color: "white",
    fontSize: 14,
  },
  emptyTitle: {
    color: theme.colors.onSurface,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptySubTitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
