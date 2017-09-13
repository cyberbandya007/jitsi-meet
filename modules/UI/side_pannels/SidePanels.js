import Chat from './chat/Chat';
import Whiteboard from './whiteboard/Whiteboard';
import SettingsMenu from './settings/SettingsMenu';
import Profile from './profile/Profile';
import ContactListView from './contactlist/ContactListView';
import { isButtonEnabled } from '../../../react/features/toolbox';

const SidePanels = {
    init (eventEmitter) {
        // Initialize chat
        if (isButtonEnabled('chat')) {
            Chat.init(eventEmitter);
        }

        // Initialize settings
        if (isButtonEnabled('settings')) {
            SettingsMenu.init(eventEmitter);
        }

        // Initialize profile
        if (isButtonEnabled('profile')) {
            Profile.init(eventEmitter);
        }

        // Initialize contact list view
        if (isButtonEnabled('contacts')) {
            ContactListView.init();
        }

        // Initialize whiteboard
        if (isButtonEnabled('whiteboard')) {
            Whiteboard.init(eventEmitter);
        }
    }
};

export default SidePanels;
