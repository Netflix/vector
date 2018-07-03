import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

var testsContext = require.context('./src', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
