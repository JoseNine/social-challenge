import { TestBed } from '@angular/core/testing';
import { SocialState } from '../interfaces/social-state.interface';
import { PersistenceService } from '../services/persistence.service';
import { SocialStore } from './social.store';

describe('SocialStore', () => {
  const persistence = {
    load: jasmine.createSpy('load'),
    save: jasmine.createSpy('save'),
  };

  beforeEach(() => {
    persistence.load.calls.reset();
    persistence.save.calls.reset();

    TestBed.configureTestingModule({
      providers: [SocialStore, { provide: PersistenceService, useValue: persistence }],
    });
  });

  it('restores seeded posts missing from older persisted state', () => {
    persistence.load.and.returnValue({
      posts: [
        {
          id: 'post-1',
          authorId: 'stored-user',
          authorName: 'Stored author',
          authorAvatarColor: '#000000',
          content: 'Stored post content',
          createdAt: new Date('2026-05-27T14:35:00.000Z').toISOString(),
          likedBy: [],
          saved: false,
          comments: [],
        },
      ],
    } satisfies Partial<SocialState>);

    const store = TestBed.inject(SocialStore);
    store.hydrate();

    expect(store.posts().map((post) => post.id)).toEqual(['post-4', 'post-3', 'post-2', 'post-1']);
    expect(store.posts().find((post) => post.id === 'post-1')?.content).toBe('Stored post content');
    expect(persistence.save).toHaveBeenCalled();
  });
});
