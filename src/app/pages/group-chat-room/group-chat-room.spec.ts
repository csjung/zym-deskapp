import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatRoom } from './group-chat-room';

describe('GroupChatRoom', () => {
  let component: GroupChatRoom;
  let fixture: ComponentFixture<GroupChatRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupChatRoom],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupChatRoom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
