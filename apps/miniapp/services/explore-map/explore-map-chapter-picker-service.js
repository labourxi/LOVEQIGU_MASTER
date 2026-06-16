/**
 * Explore Map chapter picker — read-only chapter list + local selection (wx.storage).
 * Does not mutate Content Layer or Canon data.
 */

const storyService = require('../story/story-service');
const arService = require('../ar/ar-service');

const STORAGE_KEY = 'explore_map_selected_chapter_id';

let memorySelection = null;

function getAllChapterOptions() {
  return storyService.getAllChapters().map((chapter, index) => ({
    id: chapter.id,
    title: chapter.title,
    display_title: chapter.display_title || `《${chapter.title}》`,
    label: `${index + 1}. ${chapter.title}`,
    status: chapter.status || 'active'
  }));
}

function getDefaultChapterId() {
  const chapters = storyService.getAllChapters();
  if (!chapters.length) {
    return null;
  }
  return chapters[chapters.length - 1].id;
}

function isValidChapterId(id) {
  return Boolean(id && storyService.getChapterById(id));
}

function readStoredChapterId() {
  if (memorySelection) {
    return memorySelection;
  }
  try {
    if (typeof wx !== 'undefined' && wx.getStorageSync) {
      const stored = wx.getStorageSync(STORAGE_KEY);
      if (stored && isValidChapterId(stored)) {
        return stored;
      }
    }
  } catch (e) {
    // ignore storage read failures
  }
  return null;
}

function getSelectedChapterId() {
  return readStoredChapterId() || getDefaultChapterId();
}

function setSelectedChapterId(chapterId) {
  if (!isValidChapterId(chapterId)) {
    return false;
  }
  memorySelection = chapterId;
  try {
    if (typeof wx !== 'undefined' && wx.setStorageSync) {
      wx.setStorageSync(STORAGE_KEY, chapterId);
    }
  } catch (e) {
    // ignore storage write failures
  }
  return true;
}

function getSelectedChapter() {
  const id = getSelectedChapterId();
  return id ? storyService.getChapterById(id) : null;
}

function getSelectedChapterIndex() {
  const id = getSelectedChapterId();
  const options = getAllChapterOptions();
  const index = options.findIndex((item) => item.id === id);
  return index >= 0 ? index : 0;
}

function getArEventsForChapter(chapterId) {
  return arService.getArEventsByChapterId(chapterId || getSelectedChapterId());
}

function resolveChapterIdFromOptions(options) {
  if (options && options.chapterId && isValidChapterId(options.chapterId)) {
    setSelectedChapterId(options.chapterId);
    return options.chapterId;
  }
  return getSelectedChapterId();
}

module.exports = {
  STORAGE_KEY,
  getAllChapterOptions,
  getDefaultChapterId,
  getSelectedChapterId,
  setSelectedChapterId,
  getSelectedChapter,
  getSelectedChapterIndex,
  getArEventsForChapter,
  resolveChapterIdFromOptions,
  isValidChapterId
};
