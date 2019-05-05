import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        editUser(id) {
            const self = this;

            const firstName = this.get('model.firstName');
            const lastName = this.get('model.lastName');
            const address = this.get('model.address');

            this.store.findRecord('user', id).then(function(user) {
                user.set('firstName', firstName);
                user.set('lastName', lastName);
                user.set('address', address);

                //Save to SAM App
                user.save();

                // Clear
                self.setProperties({
                    firstName: '',
                    lastName: '',
                    address: ''
                });

                self.transitionToRoute('index');
            });
        }
    }
});