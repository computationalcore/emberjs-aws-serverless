import Controller from '@ember/controller';


export default Controller.extend({
    actions: {
      addUser() {
        const firstName = this.get('firstName');
        const lastName = this.get('lastName');
        const address = this.get('address');
        
        const newUser = this.store.createRecord('user', {
            firstName,
            lastName,
            address
        });
        newUser.save();

        // Clear
        this.setProperties({
            firstName: '',
            lastName: '',
            address: ''
        });

        this.transitionToRoute('index');
      },
    }
});
