<template>
  <div class="cart-view">
    <div class="container">
      <h1>购物车</h1>
      
      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2>购物车是空的</h2>
        <p>快去添加一些美食吧！</p>
        <router-link to="/menu" class="browse-menu-btn">浏览菜单</router-link>
      </div>

      <div v-else class="cart-content">
        <!-- 购物车项目 -->
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <img :src="item.image" :alt="item.name" class="cart-item-image" />
            
            <div class="cart-item-info">
              <h3>{{ item.name }}</h3>
              <p class="item-description">{{ item.description }}</p>
              <div v-if="item.specialInstructions" class="special-instructions">
                <strong>特殊要求:</strong> {{ item.specialInstructions }}
              </div>
              <div class="item-details">
                <span class="item-category">{{ item.category }}</span>
                <span class="item-prep-time">⏱️ {{ item.prepTime }} 分钟</span>
              </div>
            </div>

            <div class="cart-item-controls">
              <div class="quantity-control">
                <button @click="decreaseQuantity(item.id)" class="quantity-btn">-</button>
                <span class="quantity">{{ item.quantity }}</span>
                <button @click="increaseQuantity(item.id)" class="quantity-btn">+</button>
              </div>
              
              <div class="item-price">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </div>
              
              <button @click="removeItem(item.id)" class="remove-btn">
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- 购物车汇总 -->
        <div class="cart-summary">
          <h2>订单汇总</h2>
          
          <div class="summary-details">
            <div class="summary-row">
              <span>商品小计</span>
              <span>¥{{ cartTotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>配送费</span>
              <span>¥{{ deliveryFee.toFixed(2) }}</span>
            </div>
            <div v-if="cartTotal > 0" class="summary-row discount">
              <span>优惠</span>
              <span>-¥{{ discount.toFixed(2) }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
              <span>总计</span>
              <span>¥{{ orderTotal.toFixed(2) }}</span>
            </div>
          </div>

          <div class="estimated-time">
            <div class="time-icon">⏰</div>
            <div>
              <p>预计送达时间</p>
              <p class="time">{{ estimatedDeliveryTime }}</p>
            </div>
          </div>

          <button @click="checkout" class="checkout-btn">
            去结算 (¥{{ orderTotal.toFixed(2) }})
          </button>
          
          <button @click="clearCart" class="clear-cart-btn">
            清空购物车
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuStore } from '@/stores/menuStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const menuStore = useMenuStore()
const {cartItems,cartTotal} = storeToRefs(menuStore)
const { clearCart } = menuStore


// 计算属性
const deliveryFee = computed(() => cartTotal.value > 50 ? 0 : 5)
const discount = computed(() => cartTotal.value > 100 ? 10 : 0)
const orderTotal = computed(() => {
  return Math.max(0, cartTotal.value + deliveryFee.value - discount.value)
})

const estimatedDeliveryTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 30)
  return now.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
})

// 方法
const increaseQuantity = (itemId: number) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item) {
    menuStore.updateCartItemQuantity(itemId, item.quantity + 1)
  }
}

const decreaseQuantity = (itemId: number) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item && item.quantity > 1) {
    menuStore.updateCartItemQuantity(itemId, item.quantity - 1)
  } else {
    removeItem(itemId)
  }
}

const removeItem = (itemId: number) => {
  menuStore.removeFromCart(itemId)
}

const checkout = () => {
  router.push('/checkout')
}
</script>

<style scoped>
.cart-view {
  padding: 2rem 0 4rem;
}

.cart-view h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-cart h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.empty-cart p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.browse-menu-btn {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.browse-menu-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  align-items: center;
}

.cart-item-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.cart-item-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cart-item-info h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.item-description {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.special-instructions {
  color: #e67e22;
  font-size: 0.85rem;
  background: #fff8e1;
  padding: 0.5rem;
  border-radius: 6px;
  border-left: 3px solid #e67e22;
}

.item-details {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #888;
}

.cart-item-controls {
  display: flex;
  flex-direction: column;
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

.item-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #667eea;
}

.remove-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: #ff3742;
  transform: scale(1.05);
}

.cart-summary {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  position: sticky;
  top: 2rem;
}

.cart-summary h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
}

.summary-details {
  margin-bottom: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #666;
}

.summary-row.discount {
  color: #27ae60;
}

.summary-row.total {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-top: 1rem;
}

.summary-divider {
  height: 1px;
  background: #eee;
  margin: 1rem 0;
}

.estimated-time {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.time-icon {
  font-size: 2rem;
}

.estimated-time p {
  margin: 0;
  color: #666;
}

.estimated-time .time {
  color: #333;
  font-weight: bold;
  font-size: 1.1rem;
}

.checkout-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.clear-cart-btn {
  width: 100%;
  background: #e0e0e0;
  color: #666;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-cart-btn:hover {
  background: #d0d0d0;
  color: #333;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .cart-item-image {
    width: 100%;
    height: 200px;
  }
}
</style>