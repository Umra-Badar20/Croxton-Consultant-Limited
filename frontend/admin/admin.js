import Swal from 'sweetalert2';

const { createApp } = Vue;

createApp({
  data() {
    return {
      authenticated: false,
      token: null,
      messages: [],
      searchQuery: '',
      loginData: {
        username: '',
        password: ''
      }
    };
  },
  computed: {
    filteredMessages() {
      const query = this.searchQuery.toLowerCase();
      return this.messages.filter(message => 
        message.name.toLowerCase().includes(query) ||
        message.email.toLowerCase().includes(query) ||
        message.subject.toLowerCase().includes(query) ||
        message.message.toLowerCase().includes(query)
      );
    }
  },
  created() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.authenticated = true;
      this.fetchMessages();
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('https://croxton-consultant-limited-production.up.railway.app/api/auth/login', this.loginData);
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        this.authenticated = true;
        await this.fetchMessages();
        
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have successfully logged in',
          timer: 2000,
          showConfirmButton: false
        });
        
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.response?.data?.message || 'Invalid credentials',
          confirmButtonText: 'Try Again'
        });
      }
    },
    async logout() {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out of the system",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout!'
      });
      
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        this.token = null;
        this.authenticated = false;
        this.messages = [];
        
        await Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been successfully logged out',
          timer: 1500,
          showConfirmButton: false
        });
      }
    },
    async fetchMessages() {
      try {
        const response = await axios.get('https://croxton-consultant-limited-production.up.railway.app/api/contact', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.messages = response.data.data;
      } catch (error) {
        if (error.response?.status === 401) {
          await Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: 'Your session has expired. Please login again.',
            confirmButtonText: 'OK'
          });
          this.logout();
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch messages. Please try again later.',
            confirmButtonText: 'OK'
          });
        }
        console.error('Error fetching messages:', error);
      }
    },
    // Bonus: Add a nice confirmation for actions
    async confirmAction(title, text, confirmText = 'Confirm') {
      return await Swal.fire({
        title: title,
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmText
      });
    }
  }
}).mount('#app');