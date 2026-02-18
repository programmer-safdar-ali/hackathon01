# Components

## HomepageFeatures
**File:** `website/src/components/HomepageFeatures/index.tsx`
**Description:** Three-column features section (unused on current homepage, legacy default)

```tsx
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

CSS:
```css
.features {
  display: flex;
  align-items: center;
  padding: 2rem 0;
  width: 100%;
}
.featureSvg {
  height: 200px;
  width: 200px;
}
```

## ModuleCard (inline in index.tsx)
**Description:** Card component for each of the 4 curriculum modules

```tsx
type ModuleCard = {
  title: string;
  number: number;
  description: string;
  link: string;
  chapters: number;
  icon: string;
};

function ModuleCardComponent({title, number, description, link, chapters, icon}: ModuleCard) {
  return (
    <div className={clsx('col col--6')} style={{marginBottom: '1.5rem'}}>
      <div className={styles.moduleCard}>
        <div className={styles.moduleHeader}>
          <span className={styles.moduleIcon}>{icon}</span>
          <span className={styles.moduleNumber}>Module {number}</span>
        </div>
        <Heading as="h3" style={{marginTop: '0.5rem'}}>
          <Link to={link} className={styles.moduleLink}>{title}</Link>
        </Heading>
        <p>{description}</p>
        <div className={styles.moduleFooter}>
          <span>{chapters} chapters</span>
          <Link to={link} className="button button--primary button--sm">Explore</Link>
        </div>
      </div>
    </div>
  );
}
```
