<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>美味在线点餐</h1>
        <p>新鲜食材，专业烹饪，30分钟内送达</p>
        <router-link to="/menu" class="cta-button">立即点餐 →</router-link>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2>为什么选择我们？</h2>
        <div class="features-grid">
          <div class="feature">
            <div class="feature-icon">🚀</div>
            <h3>快速配送</h3>
            <p>承诺30分钟内送达，超时免单</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🌟</div>
            <h3>品质保证</h3>
            <p>精选食材，大师烹饪，品质如一</p>
          </div>
          <div class="feature">
            <div class="feature-icon">💳</div>
            <h3>安全支付</h3>
            <p>多种支付方式，交易安全有保障</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Items -->
    <section class="popular-items">
      <div class="container">
        <h2>热门推荐</h2>
        <div class="menu-grid">
          <MenuItem 
            v-for="item in popularItems" 
            :key="item.id" 
            :item="item" 
          />
        </div>
        <router-link to="/menu" class="view-all-btn">查看完整菜单 →</router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMenuStore } from '@/stores/menuStore'
import MenuItem from '@/components/menu/MenuItem.vue'

const menuStore = useMenuStore()
const popularItems = computed(() => {
  return menuStore.menuItems.filter(item => item.popular).slice(0, 4)
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
              url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200') center/cover;
  color: white;
  padding: 6rem 1rem;
  text-align: center;
  margin-bottom: 4rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 30px;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.features {
  padding: 4rem 0;
  background: #f8f9fa;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.feature {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.feature p {
  color: #666;
  line-height: 1.6;
}

.popular-items {
  padding: 4rem 0;
}

.popular-items h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.view-all-btn {
  display: block;
  width: 200px;
  margin: 0 auto;
  text-align: center;
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  background: #667eea;
  color: white;
}
</style>