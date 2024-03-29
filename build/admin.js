var app = new Vue({
  el: '#admin',
  data: {
    title: "",
    description: "",
    selected:  "",
    items: [],
    addItem: null,
    findTitle: "",
    findItem: null,
    curItem: null,
    photos: [
      {name: 'baseball', id: 1, path: './images/baseball.jpg'},
      {name: 'car', id: 2, path: './images/car.jpg'},
      {name: 'glasses', id: 3, path: './images/glasses.jpg'},
      {name: 'paintbrush', id: 4, path: './images/paintbrush.jpg'},
      {name: 'pen', id: 5, path: './images/pen.jpg'},
      {name: 'scissors', id: 6, path: './images/scissors.jpg'},
      {name: 'shovel', id: 7, path: './images/shovel.jpg'},
      {name: 'slinky', id: 8, path: './images/slinky.jpg'},
    ],
  },
  methods: {
    async addNewItem(){
      try {
        console.log("this.selected", this.selected);
        let result = await axios.post('/api/items', {
          title: this.title,
          path: this.selected.path,
          description: this.description
        });
        this.addItem = result.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectItem(item) {
      console.log(item);
      this.findTitle = "";
      this.findItem = item;
      this.curItem = item;
    },
    async editItem(item) {
      try {
        console.log("cutItem: ", this.curItem);
        console.log("item: ", item);
        let response = await axios.put("/api/items/" + this.curItem.id, {item});
        return(true);     
      } catch (error) {
        console.log(error);
      }
    },
    async deleteItem(item) {
      try {
        let response = await axios.delete("/api/items/" + item.id);
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    suggestions() {
      return this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
    }
  },
  created(){
    this.getItems();
  }
});
