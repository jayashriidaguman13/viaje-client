import { reactive } from 'vue'

const UserContext = reactive({
  user: JSON.parse(localStorage.getItem('user')) || null
});

export default UserContext;