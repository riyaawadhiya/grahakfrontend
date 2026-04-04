import React, { memo, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Switch,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { useCart } from "../context/CartContext";
import QuantityControl from "./QuantityControl";
import { formatPriceCompact } from "../utils/formatPrice";

// ─── Layout Constants ──────────────────────────────────────────────────────────
const SCREEN_W        = Dimensions.get("window").width;
const HORIZONTAL_PAD  = 16;   // px either side of the grid
const COLUMN_GAP      = 12;   // px between the two columns
const NUM_COLS        = 2;
export const CARD_WIDTH =
  (SCREEN_W - HORIZONTAL_PAD * 2 - COLUMN_GAP * (NUM_COLS - 1)) / NUM_COLS;

// ─── Placeholder for items without an image ────────────────────────────────────
const PLACEHOLDER = require("../../assets/placeholder.png");

// ─── OrderCard ────────────────────────────────────────────────────────────────
/**
 * Displays a single product card in the 2-column grid.
 *
 * Props:
 *   product              {object}   the product data object
 *   onToggleAvailability {Function} (productId) => void
 */
const OrderCard = memo(({ product, onToggleAvailability }) => {
  const { addToCart, removeFromCart, getQty } = useCart();
  const qty = getQty(product.id);

  const handleAdd    = useCallback(() => addToCart(product),           [addToCart, product]);
  const handleRemove = useCallback(() => removeFromCart(product.id),   [removeFromCart, product.id]);
  const handleToggle = useCallback(() => onToggleAvailability(product.id), [onToggleAvailability, product.id]);

  const imageSource = product.image
    ? { uri: product.image }
    : PLACEHOLDER;

  return (
    <View
      style={{ width: CARD_WIDTH }}
      className="bg-white rounded-2xl overflow-hidden mb-3"
      style={{
        width: CARD_WIDTH,
        borderRadius: 16,
        backgroundColor: "#ffffff",
        overflow: "hidden",
        marginBottom: 12,
        // Elevation for Android + shadow for iOS
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      }}
    >
      {/* ── Product Image ── */}
      <View style={{ position: "relative" }}>
        <Image
          source={imageSource}
          style={{ width: "100%", height: 130 }}
          resizeMode="cover"
        />

        {/* Dimmed overlay when unavailable */}
        {!product.available && (
          <View
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.45)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>
                Unavailable
              </Text>
            </View>
          </View>
        )}

        {/* Veg / Non-veg dot — static for demo */}
        <View
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            width: 14,
            height: 14,
            borderRadius: 2,
            borderWidth: 1.5,
            borderColor: "#16a34a",
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              backgroundColor: "#16a34a",
            }}
          />
        </View>
      </View>

      {/* ── Card Body ── */}
      <View style={{ padding: 12 }}>

        {/* Title */}
        <Text
          numberOfLines={1}
          style={{ fontSize: 13, fontWeight: "700", color: "#111827", marginBottom: 2 }}
        >
          {product.title}
        </Text>

        {/* Price */}
        <Text style={{ fontSize: 15, fontWeight: "800", color: "#f97316" }}>
          {formatPriceCompact(product.price)}
        </Text>

        {/* ── Availability Toggle ── */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 10,
            paddingTop: 10,
            borderTopWidth: 0.5,
            borderTopColor: "#f3f4f6",
          }}
        >
          <Text style={{ fontSize: 11, color: product.available ? "#16a34a" : "#9ca3af", fontWeight: "600" }}>
            {product.available ? "● Available" : "○ Unavailable"}
          </Text>
          <Switch
            value={product.available}
            onValueChange={handleToggle}
            trackColor={{ false: "#e5e7eb", true: "#fdba74" }}
            thumbColor={product.available ? "#f97316" : "#d1d5db"}
            ios_backgroundColor="#e5e7eb"
            style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
          />
        </View>

        {/* ── Add / Quantity Control ── */}
        {qty === 0 ? (
          <TouchableOpacity
            onPress={handleAdd}
            disabled={!product.available}
            activeOpacity={0.75}
            style={{
              backgroundColor: product.available ? "#f97316" : "#e5e7eb",
              borderRadius: 10,
              paddingVertical: 8,
              alignItems: "center",
            }}
            accessibilityLabel={`Add ${product.title} to cart`}
            accessibilityRole="button"
          >
            <Text
              style={{
                color: product.available ? "#fff" : "#9ca3af",
                fontWeight: "700",
                fontSize: 13,
                letterSpacing: 0.3,
              }}
            >
              + Add
            </Text>
          </TouchableOpacity>
        ) : (
          <QuantityControl qty={qty} onAdd={handleAdd} onRemove={handleRemove} />
        )}
      </View>
    </View>
  );
});

OrderCard.displayName = "OrderCard";

export default OrderCard;