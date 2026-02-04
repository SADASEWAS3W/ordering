<template>
  <div class="orders-view">
    <div class="container">
      <div class="orders-header">
        <h1>我的订单</h1>
        <p>查看您的所有订单记录</p>
      </div>

      <!-- 订单状态筛选 -->
      <div class="orders-filter">
        <button
          v-for="filter in orderFilters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          :class="['filter-btn', { active: activeFilter === filter.value }]"
        >
          {{ filter.label }}
          <span v-if="filter.count" class="filter-count">{{ filter.count }}</span>
        </button>
      </div>

      <!-- 成功下单提示 -->
      <div v-if="showSuccessMessage" class="order-success">
        <div class="success-icon">🎉</div>
        <h2>下单成功！</h2>
        <p>订单号：{{ successOrderId }}</p>
        <p>我们正在为您准备美食，预计 {{ estimatedDeliveryTime }} 送达</p>
        <button @click="showSuccessMessage = false" class="close-btn">关闭</button>
      </div>

      <!-- 没有订单 -->
      <div v-if="filteredOrders.length === 0" class="no-orders">
        <div class="empty-icon">📦</div>
        <h2>暂无订单</h2>
        <p>快去挑选一些美食吧！</p>
        <router-link to="/menu" class="browse-menu-btn">浏览菜单</router-link>
      </div>

      <!-- 订单列表 -->
      <div v-else class="orders-list">
        <div v-for="order in filteredOrders" :key="order.orderId" class="order-card">
          <div class="order-header">
            <div class="order-info">
              <h3>订单号：{{ order.orderId }}</h3>
              <p class="order-time">{{ formatDate(order.orderTime) }}</p>
            </div>
            <div class="order-status" :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </div>
          </div>

          <div class="order-details">
            <div class="order-items">
              <div v-for="item in order.items" :key="item.id" class="order-item">
                <span class="item-name">{{ item.name }} × {{ item.quantity }}</span>
                <span class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <div class="order-summary">
              <div class="summary-row">
                <span>配送地址</span>
                <span class="address">{{ order.address }}</span>
              </div>
              <div class="summary-row">
                <span>联系电话</span>
                <span>{{ order.phone }}</span>
              </div>
              <div class="summary-row">
                <span>支付方式</span>
                <span>{{ getPaymentMethodText(order.paymentMethod) }}</span>
              </div>
              <div v-if="order.notes" class="summary-row">
                <span>订单备注</span>
                <span class="notes">{{ order.notes }}</span>
              </div>
            </div>

            <div class="order-total">
              <div class="total-row">
                <span>商品总额</span>
                <span>¥{{ order.subtotal?.toFixed(2) || '0.00' }}</span>
              </div>
              <div class="total-row">
                <span>配送费</span>
                <span v-if="order.deliveryFee > 0">¥{{ order.deliveryFee?.toFixed(2) || '0.00' }}</span>
                <span v-else class="free">免费</span>
              </div>
              <div v-if="order.discount > 0" class="total-row discount">
                <span>优惠减免</span>
                <span>-¥{{ order.discount?.toFixed(2) || '0.00' }}</span>
              </div>
              <div class="total-row grand-total">
                <span>实付金额</span>
                <span>¥{{ order.total?.toFixed(2) || '0.00' }}</span>
              </div>
            </div>
          </div>

          <div class="order-actions">
            <button v-if="order.status === 'delivered'" class="action-btn reorder-btn">
              🔁 再次下单
            </button>
            <button v-if="order.status === 'preparing' || order.status === 'on_the_way'" 
                    class="action-btn track-btn">
              📍 跟踪订单
            </button>
            <button class="action-btn contact-btn">
              📞 联系商家
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  specialInstructions?: string
}

interface Order {
  orderId: string
  orderTime: string
  status: 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled'
  items: OrderItem[]
  name: string
  phone: string
  address: string
  apartment?: string
  postalCode?: string
  deliveryTime: string
  paymentMethod: string
  notes?: string
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
}

// 状态
const activeFilter = ref('all')
const showSuccessMessage = ref(false)
const successOrderId = ref('')
const orders = ref<Order[]>([])

// 计算属性
const orderFilters = computed(() => [
  { value: 'all', label: '全部订单', count: orders.value.length },
  { value: 'pending', label: '待处理', count: orders.value.filter(o => o.status === 'pending').length },
  { value: 'preparing', label: '准备中', count: orders.value.filter(o => o.status === 'preparing').length },
  { value: 'on_the_way', label: '配送中', count: orders.value.filter(o => o.status === 'on_the_way').length },
  { value: 'delivered', label: '已完成', count: orders.value.filter(o => o.status === 'delivered').length }
])

const filteredOrders = computed(() => {
  if (activeFilter.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === activeFilter.value)
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
const loadOrders = () => {
  const savedOrders = localStorage.getItem('foodOrders')
  if (savedOrders) {
    orders.value = JSON.parse(savedOrders)
  } else {
    // 模拟一些订单数据用于演示
    orders.value = [
      {
        orderId: 'ORD20231215001',
        orderTime: '2023-12-15T18:30:00',
        status: 'delivered',
        items: [
          { id: 1, name: '宫保鸡丁', price: 38, quantity: 1 },
          { id: 4, name: '意大利面', price: 48, quantity: 1 },
          { id: 6, name: '抹茶拿铁', price: 28, quantity: 2 }
        ],
        name: '张三',
        phone: '13800138000',
        address: '北京市朝阳区望京SOHO T1座',
        deliveryTime: 'asap',
        paymentMethod: 'alipay',
        notes: '不要放葱',
        subtotal: 114,
        deliveryFee: 0,
        discount: 10,
        total: 104
      },
      {
        orderId: 'ORD20231214002',
        orderTime: '2023-12-14T19:15:00',
        status: 'on_the_way',
        items: [
          { id: 2, name: '麻辣香锅', price: 68, quantity: 1 },
          { id: 5, name: '鲜榨橙汁', price: 18, quantity: 2 }
        ],
        name: '李四',
        phone: '13900139000',
        address: '北京市海淀区中关村大街',
        deliveryTime: 'specific',
        paymentMethod: 'wechat',
        subtotal: 104,
        deliveryFee: 0,
        discount: 10,
        total: 94
      }
    ]
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusText = (status: Order['status']) => {
  const statusMap = {
    pending: '待确认',
    preparing: '准备中',
    on_the_way: '配送中',
    delivered: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知状态'
}

const getStatusClass = (status: Order['status']) => {
  const classMap = {
    pending: 'status-pending',
    preparing: 'status-preparing',
    on_the_way: 'status-on-the-way',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled'
  }
  return classMap[status] || ''
}

const getPaymentMethodText = (method: string) => {
  const methodMap = {
    alipay: '支付宝',
    wechat: '微信支付',
    cash: '货到付款',
    card: '在线支付'
  }
  return methodMap[method as keyof typeof methodMap] || method
}

// 生命周期
onMounted(() => {
  loadOrders()
  
  // 检查是否从结算页面跳转过来
  const route = useRoute()
  if (route.query.success === 'true' && route.query.orderId) {
    showSuccessMessage.value = true
    successOrderId.value = route.query.orderId as string
    
    // 3秒后自动隐藏成功消息
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 5000)
  }
})
</script>

<style scoped>
.orders-view {
  padding: 2rem 0 4rem;
  min-height: 100vh;
  background: #f8f9fa;
}

.orders-header {
  text-align: center;
  margin-bottom: 3rem;
}

.orders-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.orders-header p {
  color: #666;
  font-size: 1.1rem;
}

.orders-filter {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  padding: 0.5rem 1.5rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f8f9ff;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.filter-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
}

.filter-btn.active .filter-count {
  background: rgba(255, 255, 255, 0.3);
}

.order-success {
  background: linear-gradient(135deg, #4cd964 0%, #5ac8fa 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.order-success h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.order-success p {
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.close-btn {
  margin-top: 1rem;
  background: white;
  color: #4cd964;
  border: none;
  padding: 0.5rem 2rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
}

.no-orders {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-orders h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.no-orders p {
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

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9ff;
  border-bottom: 1px solid #eee;
}

.order-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.order-time {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-preparing {
  background: #cce5ff;
  color: #004085;
  border: 1px solid #b8daff;
}

.status-on-the-way {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.status-delivered {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.order-details {
  padding: 1.5rem;
}

.order-items {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.order-item:not(:last-child) {
  border-bottom: 1px solid #f5f5f5;
}

.item-name {
  color: #333;
  font-weight: 500;
}

.item-price {
  color: #667eea;
  font-weight: 600;
}

.order-summary {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.summary-row span:first-child {
  color: #666;
  min-width: 80px;
}

.summary-row span:last-child {
  color: #333;
  text-align: right;
  flex: 1;
  margin-left: 1rem;
}

.address {
  word-break: break-all;
}

.notes {
  color: #e67e22;
  font-style: italic;
}

.order-total {
  background: #f8f9ff;
  padding: 1.5rem;
  border-radius: 8px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #666;
}

.total-row.grand-total {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #e0e0e0;
}

.total-row.discount {
  color: #27ae60;
}

.free {
  color: #27ae60;
  font-weight: 600;
}

.order-actions {
  padding: 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reorder-btn {
  background: #667eea;
  color: white;
}

.reorder-btn:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.track-btn {
  background: #4cd964;
  color: white;
}

.track-btn:hover {
  background: #3dc752;
  transform: translateY(-2px);
}

.contact-btn {
  background: #ff9500;
  color: white;
}

.contact-btn:hover {
  background: #e68500;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .order-status {
    align-self: flex-start;
  }
  
  .order-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>