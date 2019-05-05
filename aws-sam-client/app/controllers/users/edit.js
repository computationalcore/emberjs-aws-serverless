import Controller from '@ember/controller';

export default Controller.extend({
    loading: false,
    loadingText: '',
    actions: {
        editUser(id) {
            const self = this;

            const firstName = this.get('model.firstName') ? this.get('model.firstName') : ' ';
            const lastName = this.get('model.lastName') ? this.get('model.lastName') : ' ';
            const address = this.get('model.address') ? this.get('model.address') : ' ';

            this.store.findRecord('user', id).then(function(user) {
                user.set('firstName', firstName);
                user.set('lastName', lastName);
                user.set('address', address);
                
                // Show loader
                self.setProperties({
                    loading: true,
                    loadingText: `Saving ${firstName} ${lastName}...`
                });

                //Save to SAM App
                user.save()
                .then(function(){
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
                })
                ;                
            });
        }
    }
});