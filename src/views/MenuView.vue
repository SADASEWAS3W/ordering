<template>
  <div class="menu-view">
    <!-- 搜索和筛选 -->
    <div class="menu-header">
      <div class="container">
        <h1>菜单</h1>
        
        <div class="search-section">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索菜品..."
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>
          
          <div class="category-filters">
            <button
              v-for="category in categories"
              :key="category"
              @click="selectCategory(category)"
              :class="['category-btn', { active: selectedCategory === category }]"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 菜单列表 -->
    <div class="container">
      <div v-if="filteredMenu.length === 0" class="no-results">
        <p>没有找到符合条件的菜品</p>
      </div>
      
      <div v-else class="menu-grid">
        <MenuItem
          v-for="item in filteredMenu"
          :key="item.id"
          :item="item"
        ></MenuItem>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMenuStore } from '@/stores/menuStore'
import { storeToRefs } from 'pinia'
import MenuItem from '@/components/menu/MenuItem.vue'

const menuStore = useMenuStore()
const { categories, filteredMenu, searchQuery: storeSearchQuery, selectedCategory: storeSelectedCategory } = storeToRefs(menuStore)

// 创建本地ref用于双向绑定
const searchQuery = ref(storeSearchQuery.value)
const selectedCategory = ref(storeSelectedCategory.value)

// 监听搜索框变化
watch(searchQuery, (newValue) => {
  menuStore.searchQuery = newValue
})

// 监听分类变化
watch(selectedCategory, (newValue) => {
  menuStore.selectedCategory = newValue
})

const selectCategory = (category: string) => {
  selectedCategory.value = category
}
</script>

<style scoped>
.menu-view {
  padding-bottom: 4rem;
}

.menu-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 3rem;
}

.menu-header h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.search-section {
  max-width: 800px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.search-icon {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
}

.category-filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.category-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.category-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: white;
}

.category-btn.active {
  background: white;
  color: #667eea;
  border-color: white;
  font-weight: 600;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.no-results {
  text-align: center;
  padding: 4rem;
  color: #666;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }
}
</style>