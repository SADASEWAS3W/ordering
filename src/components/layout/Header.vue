<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <router-link to="/" class="logo">
          <h1>🍽️ 小裴餐厅</h1>
        </router-link>
        
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/menu" class="nav-link">菜单</router-link>
          <router-link to="/orders" class="nav-link">我的订单</router-link>
        </nav>
        
        <div class="cart-section">
          <router-link to="/cart" class="cart-button">
            🛒 购物车
            <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
          </router-link>
          <div class="cart-total" v-if="cartTotal > 0">
            ¥{{ cartTotal.toFixed(2) }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/menuStore'
import { storeToRefs } from 'pinia'

const menuStore = useMenuStore()
const { cartCount, cartTotal } = storeToRefs(menuStore)
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0,0,0,0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.logo {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.logo h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.nav {
  display: flex;
  gap: 2rem;
  flex-grow: 1;
  justify-content: center;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link.router-link-exact-active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.cart-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-button {
  background: white;
  color: #667eea;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
}

.cart-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.cart-count {
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  position: absolute;
  top: -8px;
  right: -8px;
}

.cart-total {
  font-weight: bold;
  font-size: 1.1rem;
  color: white;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav {
    gap: 1rem;
  }
}
</style>