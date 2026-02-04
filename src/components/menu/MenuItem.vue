<template>
  <div class="menu-item" :class="{ 'popular-item': item.popular }">
    <div class="item-image">
      <img :src="item.image" :alt="item.name" />
      <div v-if="item.popular" class="popular-badge">🔥 热门</div>
    </div>
    
    <div class="item-content">
      <div class="item-header">
        <h3 class="item-name">{{ item.name }}</h3>
        <span class="item-price">¥{{ item.price }}</span>
      </div>
      
      <p class="item-description">{{ item.description }}</p>
      
      <div class="item-details">
        <span class="item-category">{{ item.category }}</span>
        <span class="item-calories" v-if="item.calories">{{ item.calories }} 卡路里</span>
        <span class="item-prep-time">⏱️ {{ item.prepTime }} 分钟</span>
      </div>
      
      <div class="item-actions">
        <div class="quantity-control" v-if="inCart">
          <button @click="decreaseQuantity" class="quantity-btn">-</button>
          <span class="quantity">{{ cartItem?.quantity || 0 }}</span>
          <button @click="increaseQuantity" class="quantity-btn">+</button>
        </div>
        
        <button 
          @click="addToCart" 
          class="add-to-cart-btn"
          :disabled="!item.available"
        >
          {{ !item.available ? '已售罄' : inCart ? '已在购物车' : '加入购物车' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMenuStore } from '@/stores/menuStore'
import type { MenuItem as MenuItemType, CartItem } from '@/stores/menuStore'

const props = defineProps<{
  item: MenuItemType
}>()

const menuStore = useMenuStore()

const cartItem = computed(() => {
  return menuStore.cartItems.find((item: CartItem) => item.id === props.item.id)
})

const inCart = computed(() => {
  return cartItem.value !== undefined
})

const addToCart = () => {
  if (props.item.available) {
    menuStore.addToCart(props.item, 1)
  }
}

const increaseQuantity = () => {
  if (cartItem.value) {
    menuStore.updateCartItemQuantity(props.item.id, cartItem.value.quantity + 1)
  }
}

const decreaseQuantity = () => {
  if (cartItem.value && cartItem.value.quantity > 1) {
    menuStore.updateCartItemQuantity(props.item.id, cartItem.value.quantity - 1)
  } else {
    menuStore.removeFromCart(props.item.id)
  }
}
</script>

<style scoped>
.menu-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.menu-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.popular-item {
  border: 2px solid #ffd700;
}

.item-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.menu-item:hover .item-image img {
  transform: scale(1.05);
}

.popular-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4757;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.item-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.item-name {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
}

.item-price {
  color: #667eea;
  font-size: 1.4rem;
  font-weight: bold;
}

.item-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  flex-grow: 1;
}

.item-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.item-category, .item-calories, .item-prep-time {
  font-size: 0.85rem;
  color: #888;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.5rem;
}

.quantity-btn {
  background: white;
  border: 2px solid #667eea;
  color: #667eea;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.quantity-btn:hover {
  background: #667eea;
  color: white;
}

.quantity {
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

.add-to-cart-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-grow: 1;
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>