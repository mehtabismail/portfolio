import { ArrowIcon, DefaultNavBar } from "@/components";
import type { ContactContent, SiteContent, UserData } from "@/data";
import { getContactContentData, getSiteContentData, getUserContent } from "@/lib/content";

type Props = {
  basePath?: string;
  contactContent?: ContactContent;
  siteContent?: SiteContent;
  user?: UserData;
  prependNav?: ReadonlyArray<{ href: string; label: string }>;
};

export default async function ContactPageContent({
  basePath = "",
  contactContent: contactProp,
  siteContent: siteProp,
  user: userProp,
  prependNav,
}: Props) {
  const [contactContent, siteContent, user] = await Promise.all([
    contactProp ? Promise.resolve(contactProp) : getContactContentData(),
    siteProp ? Promise.resolve(siteProp) : getSiteContentData(),
    userProp ? Promise.resolve(userProp) : getUserContent(),
  ]);

  return (
    <div className="main-wrap" data-scroll-container>
      <header className="section default-header contact-header theme-dark once-in" data-scroll-section>
        <DefaultNavBar
          active="contact"
          basePath={basePath}
          siteContent={siteContent}
          user={user}
          prependNav={prependNav}
        />
        <div className="container medium">
          <div className="row once-in">
            <div className="flex-col">
              <h1>
                <span>
                  <div className="profile-picture" /> {contactContent.heroLine1}{" "}
                </span>
                <span>{contactContent.heroLine2}</span>
              </h1>
            </div>
            <div className="flex-col">
              <div className="profile-picture" />
              <ArrowIcon className="arrow" />
            </div>
          </div>
          <div className="row once-in">
            <div className="flex-col">
              <form
                className="form"
                method="post"
                action="https://dennissnellenberg.com/contact"
                encType="multipart/form-data"
                noValidate
              >
                <div className="website-field">
                  <label className="label" htmlFor="form-tel">
                    {contactContent.form.fieldPhone}
                  </label>
                  <input className="field" type="text" id="form-tel" name="tel" tabIndex={-1} autoComplete="off" />
                </div>
                <div className="form-col">
                  <h5>01</h5>
                  <label className="label" htmlFor="form-name">
                    {contactContent.form.fieldName}
                  </label>
                  <input
                    className="field"
                    type="text"
                    id="form-name"
                    name="name"
                    required
                    placeholder={contactContent.form.placeholderName}
                  />
                </div>
                <div className="form-col">
                  <h5>02</h5>
                  <label className="label" htmlFor="form-email">
                    {contactContent.form.fieldEmail}
                  </label>
                  <input
                    className="field"
                    type="email"
                    id="form-email"
                    name="email"
                    required
                    placeholder={contactContent.form.placeholderEmail}
                  />
                </div>
                <div className="form-col">
                  <h5>03</h5>
                  <label className="label" htmlFor="form-company">
                    {contactContent.form.fieldCompany}
                  </label>
                  <input
                    className="field"
                    type="text"
                    id="form-company"
                    name="company"
                    required
                    placeholder={contactContent.form.placeholderCompany}
                  />
                </div>
                <div className="form-col">
                  <h5>04</h5>
                  <label className="label" htmlFor="form-service">
                    {contactContent.form.fieldService}
                  </label>
                  <input
                    className="field"
                    type="text"
                    id="form-service"
                    name="service"
                    required
                    placeholder={contactContent.form.placeholderService}
                  />
                </div>
                <div className="form-col">
                  <h5>05</h5>
                  <label className="label" htmlFor="form-message">
                    {contactContent.form.fieldMessage}
                  </label>
                  <textarea
                    className="field"
                    id="form-message"
                    name="message"
                    rows={8}
                    required
                    placeholder={`Hello ${user.firstName}, can you help me with ... *`}
                  />
                </div>
                <div className="btn-contact-send">
                  <div className="btn btn-round" data-scroll data-scroll-speed="2" data-scroll-offset="-50%, 0%">
                    <div className="btn-click magnetic" data-strength="100" data-strength-text="50">
                      <div className="btn-fill" />
                      <span className="btn-text">
                        <input
                          type="submit"
                          name="submit"
                          value={contactContent.form.submitLabel}
                          className="form-btn"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="flex-col">
              <h5>{contactContent.sections.contactDetails}</h5>
              <ul className="links-wrap">
                {user.email ? (
                  <li className="btn btn-link btn-link-external">
                    <a
                      href={`mailto:${user.email}`}
                      className="btn-click magnetic"
                      data-strength="20"
                      data-strength-text="10"
                    >
                      <span className="btn-text">
                        <span className="btn-text-inner">{user.email}</span>
                      </span>
                    </a>
                  </li>
                ) : null}
                {user.phoneRaw ? (
                  <li className="btn btn-link btn-link-external">
                    <a
                      href={`tel:${user.phoneRaw}`}
                      className="btn-click magnetic"
                      data-strength="20"
                      data-strength-text="10"
                    >
                      <span className="btn-text">
                        <span className="btn-text-inner">{user.phoneDisplay}</span>
                      </span>
                    </a>
                  </li>
                ) : null}
              </ul>
              <h5>{contactContent.sections.businessDetails}</h5>
              <ul className="links-wrap">
                <li>
                  <p>{user.legalName}</p>
                </li>
                {user.coc ? (
                  <li>
                    <p>CoC: {user.coc}</p>
                  </li>
                ) : null}
                {user.vat ? (
                  <li>
                    <p>VAT: {user.vat}</p>
                  </li>
                ) : null}
                <li>
                  <p>Location: {user.location}</p>
                </li>
              </ul>
              <h5>{siteContent.common.socialsTitle}</h5>
              <ul className="links-wrap">
                {user.socials.map(({ href, label }) => (
                  <li key={href} className="btn btn-link btn-link-external">
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-click magnetic"
                      data-strength="20"
                      data-strength-text="10"
                    >
                      <span className="btn-text">
                        <span className="btn-text-inner">{label}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
