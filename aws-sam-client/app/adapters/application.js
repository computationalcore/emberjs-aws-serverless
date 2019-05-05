import DS from 'ember-data';
import ENV from 'aws-sam-client/config/environment';

export default DS.RESTAdapter.extend({
    host: ENV.webServiceURL
});