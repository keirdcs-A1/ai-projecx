"""Offline checks of feed safety and date/relevance handling."""
import unittest
import sys
sys.dont_write_bytecode = True
import build_snapshot as build


class FeedTests(unittest.TestCase):
    source = {'id': 'test', 'hosts': ['publisher.example']}

    def test_url_boundary(self):
        self.assertIsNone(build.safe_url('https://attacker.example/story', self.source['hosts']))
        self.assertIsNone(build.safe_url('https://name:password' + chr(64) + 'publisher.example/story', self.source['hosts']))
        self.assertIsNone(build.safe_url('http://publisher.example/story', self.source['hosts']))
        self.assertEqual(build.safe_url('https://publisher.example/story?utm_source=test&article=2#section', self.source['hosts']), 'https://publisher.example/story?article=2')

    def test_rss_relevance_and_timestamps(self):
        future = (build.NOW + build.dt.timedelta(days=1)).isoformat()
        stamp = build.STAMP
        xml = f'''<rss><channel>
        <item><title>Iran nuclear talks</title><link>https://publisher.example/a</link><pubDate>{stamp}</pubDate></item>
        <item><title>Iran future report</title><link>https://publisher.example/b</link><pubDate>{future}</pubDate></item>
        <item><title>Iran undated</title><link>https://publisher.example/c</link><pubDate>2026-01-01T12:00:00</pubDate></item>
        <item><title>Sport only</title><link>https://publisher.example/d</link><pubDate>{stamp}</pubDate></item>
        </channel></rss>'''.encode()
        items, count, undated, future_count = build.parse(xml, self.source)
        self.assertEqual((len(items), count, undated, future_count), (1, 4, 1, 1))
        self.assertEqual(items[0]['topics'], ['Nuclear', 'Diplomacy & sanctions'])

    def test_atom_alternate_link(self):
        xml = f'''<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Tehran diplomacy</title><link rel="alternate" href="https://publisher.example/story"/><updated>{build.STAMP}</updated></entry></feed>'''.encode()
        items, _, _, _ = build.parse(xml, self.source)
        self.assertEqual(items[0]['timestampKind'], 'updated')
        self.assertEqual(items[0]['url'], 'https://publisher.example/story')


if __name__ == '__main__':
    unittest.main()
