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
        const response = await axios.post('https://croxton-consultant-limited.vercel.app/admin/index.html', this.loginData);
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        this.authenticated = true;
        this.fetchMessages();
      } catch (error) {
        alert(error.response?.data?.message || 'Login failed');
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.token = null;
      this.authenticated = false;
      this.messages = [];
    },
    async fetchMessages() {
      try {
        const response = await axios.get('https://croxton-consultant-limited.vercel.app/contact.html', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.messages = response.data.data;
      } catch (error) {
        if (error.response?.status === 401) {
          this.logout();
        }
        console.error('Error fetching messages:', error);
      }
    }
  }
}).mount('#app');
