import { Route } from "@angular/router";
import { Pages } from "./pages";
import { ChatList } from "./chat-list/chat-list";
import { CargoList } from "./cargo-list/cargo-list";
import { ShareList } from "./share-list/share-list";
import { AutoOrder } from "./auto-order/auto-order";
import { LocFind } from "./loc-find/loc-find";
import { GroupChatRoom } from "./group-chat-room/group-chat-room";
import { MyInfo } from "./my-info/my-info";
import { CargoInput } from "./cargo-input/cargo-input";

export const PAGES_ROUTES: Route[] = [    
    { path: '', redirectTo: 'pages', pathMatch: 'full' },
    { path: 'pages', component:Pages,
      children: [
        { path: 'cargo-list', component: CargoList},
        { path: 'cargo-list/:inDate', component:CargoList}, 
        { path: 'cargo-input/:id', component:CargoInput}, 
        { path: 'share-list', component: ShareList},
        { path: 'auto-order', component: AutoOrder},
        { path: 'loc-find', component: LocFind},
        { path: 'chat-list', component: ChatList},
        { path: 'my-info', component: MyInfo},
        { path: 'group-chat-room/:id', component:GroupChatRoom},  
        { path: 'group-chat-room/:id/:to', component:GroupChatRoom,}, 
        { path: '', redirectTo: 'cargo-list', pathMatch: 'full' },        
      ]  
    },
];
