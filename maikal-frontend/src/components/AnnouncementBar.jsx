const TEXT = '';

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        <span dangerouslySetInnerHTML={{ __html: TEXT.replace('Bhopal & Indore only', '<strong>Bhopal &amp; Indore only</strong>') }} />
        <span dangerouslySetInnerHTML={{ __html: TEXT.replace('Bhopal & Indore only', '<strong>Bhopal &amp; Indore only</strong>') }} />
      </div>
    </div>
  );
}
