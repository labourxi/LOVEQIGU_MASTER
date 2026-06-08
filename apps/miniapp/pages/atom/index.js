const atomService = require('../../services/atom/atom-service');

function mapAtoms() {
  return atomService.getAllAtoms().map((atom) => ({
    id: atom.atom_id,
    title: atom.title,
    meta: atom.flow_ref,
    copy: atom.copy,
    tag: atom.asset_ref,
    path: atom.next_path
  }));
}

function buildPageData() {
  return {
    title: 'Atom',
    intro: 'Path A continues from AR Entry through approved Atom records and into Lottie.',
    highlights: ['Existing CH01 refs only', 'No new Canon', 'Continue to Lottie'],
    sectionTitle: 'Atom records',
    sectionSubtitle: 'These entries only surface approved flow references.',
    actionLabel: 'Open Lottie',
    items: mapAtoms()
  };
}

Page({
  data: buildPageData(),

  onLoad() {
    this.setData(buildPageData());
  },

  onNavigate(event) {
    const { path } = event.currentTarget.dataset;

    wx.navigateTo({
      url: path
    });
  }
});
