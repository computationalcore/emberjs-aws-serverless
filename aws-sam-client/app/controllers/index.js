import Controller from '@ember/controller';

export default Controller.extend({
    loading: false,
    loadingText: '',
    // Used to control modal state
    modal: false,
    selectedUser: null,
    actions: {
        showModal(report) {
            this.set('selectedUser', report);
            this.set('modal', true);            
        },
        hideModal() {
            this.set('modal', false);
        },
        deleteUser(id) {
            const self = this;

            // Show loader
            self.setProperties({
                loading: true,
                loadingText: `Removing user...`
            });

            this.store.findRecord('user', id).then(function(user) {
                user.deleteRecord();
                //Save to AWS SAM
                user.save().then(function(){
                    self.set('modal', false);
                    // Clear
                    self.setProperties({
                        loading: false,
                        loadingText: ''
                    });
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
            });
        }
    }
});