import Controller from '@ember/controller';

export default Controller.extend({
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
            this.store.findRecord('user', id).then(function(user) {
                user.deleteRecord();
                //Save to AWS SAM
                user.save().then(function(){
                    self.set('modal', false);
                });
            });
        }
    }
});