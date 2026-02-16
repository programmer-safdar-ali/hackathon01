import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

export default function NotFound(): ReactNode {
  return (
    <Layout title="Page Not Found">
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          padding: '2rem',
          textAlign: 'center',
        }}>
        <Heading as="h1">404 - Page Not Found</Heading>
        <p style={{fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2rem'}}>
          The chapter or page you are looking for does not exist or may have been
          moved. Use the links below to navigate back to the textbook.
        </p>
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'}}>
          <Link className="button button--primary button--lg" to="/docs/">
            Go to Textbook
          </Link>
          <Link className="button button--outline button--primary button--lg" to="/">
            Home Page
          </Link>
        </div>
      </main>
    </Layout>
  );
}
