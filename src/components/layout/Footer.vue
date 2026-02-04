<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>🍽️ 美味餐厅</h3>
          <p>为您提供最优质的外卖服务</p>
        </div>
        
        <div class="footer-section">
          <h4>联系我们</h4>
          <p>📞 400-123-4567</p>
          <p>📧 service@delicious.com</p>
          <p>🏢 北京市朝阳区美食街123号</p>
        </div>
        
        <div class="footer-section">
          <h4>营业时间</h4>
          <p>周一至周日: 9:00 - 22:00</p>
          <p>节假日正常营业</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 美味餐厅. 保留所有权利.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer {
  background: #333;
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
}

.footer-section h4 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #fff;
}

.footer-section p {
  color: #bbb;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #444;
  color: #bbb;
  font-size: 0.9rem;
}
</style>