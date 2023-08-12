import mock from './mock'
import './cards'
import './auth/jwt'
import './pages/faq'
import './apps/calls'
import './autocomplete'
import './pages/pricing'
import './pages/profile'
import './iconify-icons'
import './pages/help-center'
import './server-side-menu/vertical'
import './server-side-menu/horizontal'

mock.onAny().passThrough()
