import Controller from '@ember/controller';


export default Controller.extend({
    loading: false,
    loadingText: '',
    actions: {
      addUser() {
        const self = this;

        const firstName = this.get('firstName') ? this.get('firstName') : ' ';
        const lastName = this.get('lastName') ? this.get('lastName') : ' ';
        const address = this.get('address') ? this.get('address') : ' ';
        
        const newUser = this.store.createRecord('user', {
            firstName,
            lastName,
            address
        });

        // Show loader
        self.setProperties({
            loading: true,
            loadingText: `Saving ${firstName} ${lastName}...`
        });
        
        newUser.save().then(function(){
          // Clear
          self.setProperties({
              firstName: '',
              lastName: '',
              address: '',
              loading: false,
              loadingText: ''
          });

          self.transitionToRoute('index');
        })
        .catch(function(error){
          console.log(error);
          // Clear
          self.setProperties({
              loading: false,
              loadingText: ''
          });

          alert('Error while saving the data. Check the connection if the API server if up and running');
        });
      },
    }
});
