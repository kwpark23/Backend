<template>
    <div class="container">
        <div class="card-header">Create Users</div>
            <div class="card-body">
                <form @submit="formSubmit">
                    <strong>Company Name</strong>
                    <input type="text" class="form-control" v-model="companyName">
            
                    <strong>Location</strong>
                    <input class="form-control" v-model="location">

                    <strong>Store Number</strong>
                    <input class="form-control" v-model="storeNumber">

                    <strong>EDI Order Number</strong>
                    <input class="form-control" v-model="ediOrderNumber">
    
                    <button class="btn btn-success">Submit</button>
                </form>
    
                <strong>Output:</strong>
                <pre> {{output}} </pre>
            </div>
        </div>
</template>
     
<script>
    export default {
        mounted() {
            console.log('Component mounted.')
        },
        data() {
            return {
              companyName: '',
              location: '',
              storeNumber: '',
              ediOrderNumber: '',
              inventory: {},
              output: ''
            };
        },
        methods: {
            formSubmit(e) {
                e.preventDefault();
                let currentObj = this;
                this.axios.post("http://localhost:5000/send-foodz-1a677/us-central1/app/groceryStore/updateUserAccount", {
                    companyName: this.name,
                    location: this.location,
                    storeNumber: this.storeNumber,
                    ediOrderNumber: this.ediOrderNumber,
                    inventory: this.inventory
                })
                .then(function (response) {
                    currentObj.output = response.data;
                })
                .catch(function (error) {
                    currentObj.output = error;
                });
            }
        }
    }
</script>