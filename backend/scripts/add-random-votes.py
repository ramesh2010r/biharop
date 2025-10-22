#!/usr/bin/env python3
"""
Script to add random votes to all candidates
Maintains alliance hierarchy: NDA > INDIA > Jan Suraj > AAP
Each candidate gets 1-10 random votes
"""

import mysql.connector
import random
import sys
from datetime import datetime

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'opinionpoll',
    'password': 'BiharPoll2025Secure',
    'database': 'bihar_opinion_poll'
}

# Alliance hierarchy weights (higher = more votes)
# Define vote ranges for each alliance
# NDA gets more votes to lead
ALLIANCE_WEIGHTS = {
    'NDA': (6, 10),      # NDA: 6-10 votes per candidate (LEADING)
    'INDIA': (3, 6),     # INDIA: 3-6 votes per candidate
    'Jan Suraj': (2, 4), # Jan Suraj: 2-4 votes per candidate
    'AAP': (1, 2),       # AAP: 1-2 votes per candidate
    'Other': (1, 2)      # Others: 1-2 votes per candidate
}

# Party to Alliance mapping
PARTY_ALLIANCE_MAP = {
    # NDA Alliance
    'BJP': 'NDA',
    'JD(U)': 'NDA',
    'LJP (Ram Vilas)': 'NDA',
    'HAM': 'NDA',
    'HAM(S)': 'NDA',
    
    # INDIA Alliance
    'RJD': 'INDIA',
    'INC': 'INDIA',
    'Congress': 'INDIA',
    'CPI(ML)(L)': 'INDIA',
    'CPI(M)': 'INDIA',
    'CPI': 'INDIA',
    
    # Jan Suraj
    'Jan Suraj': 'Jan Suraj',
    'Jan Suraj Party': 'Jan Suraj',
    
    # AAP
    'AAP': 'AAP',
    'Aam Aadmi Party': 'AAP',
}

def get_alliance(party_abbreviation):
    """Determine alliance based on party"""
    for party, alliance in PARTY_ALLIANCE_MAP.items():
        if party.lower() in party_abbreviation.lower():
            return alliance
    return 'Other'

def generate_fake_fingerprint():
    """Generate a fake browser fingerprint"""
    canvas_hash = ''.join([str(random.randint(0, 9)) for _ in range(16)])
    webgl_hash = ''.join([str(random.randint(0, 9)) for _ in range(16)])
    audio_hash = ''.join([str(random.randint(0, 9)) for _ in range(16)])
    
    fingerprint = f"{canvas_hash}|{webgl_hash}|{audio_hash}"
    return fingerprint

def add_votes_to_candidates():
    """Add random votes to all candidates based on alliance hierarchy"""
    
    conn = None
    cursor = None
    
    try:
        # Connect to database
        print("🔌 Connecting to database...")
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        # Get all candidates with their party info
        print("📊 Fetching all candidates...")
        cursor.execute("""
            SELECT 
                c.id as candidate_id,
                c.name_hindi,
                c.name_english,
                c.constituency_id,
                p.short_code as party_abbreviation,
                p.name_hindi as party_name
            FROM Candidates c
            JOIN Parties p ON c.party_id = p.id
            ORDER BY c.constituency_id, c.id
        """)
        
        candidates = cursor.fetchall()
        print(f"✅ Found {len(candidates)} candidates")
        
        if len(candidates) == 0:
            print("⚠️  No candidates found in database!")
            return
        
        total_votes_added = 0
        constituency_stats = {}
        
        print("\n🗳️  Adding votes to candidates...\n")
        
        for candidate in candidates:
            candidate_id = candidate['candidate_id']
            constituency_id = candidate['constituency_id']
            party_abbr = candidate['party_abbreviation']
            name = candidate['name_hindi'] or candidate['name_english']
            
            # Determine alliance
            alliance = get_alliance(party_abbr)
            
            # Get vote range based on alliance
            min_votes, max_votes = ALLIANCE_WEIGHTS.get(alliance, (1, 3))
            
            # Generate random number of votes
            num_votes = random.randint(min_votes, max_votes)
            
            # Add votes for this candidate
            for i in range(num_votes):
                fingerprint = generate_fake_fingerprint()
                ip_address = f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}"
                user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                
                # Insert vote
                cursor.execute("""
                    INSERT INTO Opinions (candidate_id, constituency_id, fingerprint_hash, ip_address, user_agent, voted_at)
                    VALUES (%s, %s, %s, %s, %s, NOW())
                """, (candidate_id, constituency_id, fingerprint, ip_address, user_agent))
            
            total_votes_added += num_votes
            
            # Track constituency stats
            if constituency_id not in constituency_stats:
                constituency_stats[constituency_id] = 0
            constituency_stats[constituency_id] += num_votes
            
            # Print progress
            alliance_emoji = {
                'NDA': '🔶',
                'INDIA': '🔴',
                'Jan Suraj': '🟡',
                'AAP': '🟢',
                'Other': '⚪'
            }.get(alliance, '⚪')
            
            print(f"{alliance_emoji} {name} ({party_abbr}) - {alliance}: Added {num_votes} votes")
        
        # Commit all votes
        conn.commit()
        
        print(f"\n{'='*60}")
        print(f"✅ SUCCESS!")
        print(f"{'='*60}")
        print(f"📊 Total votes added: {total_votes_added}")
        print(f"👥 Candidates voted for: {len(candidates)}")
        print(f"🏛️  Constituencies with votes: {len(constituency_stats)}")
        print(f"📈 Average votes per candidate: {total_votes_added / len(candidates):.2f}")
        print(f"📈 Average votes per constituency: {total_votes_added / len(constituency_stats):.2f}")
        
        # Show alliance distribution
        print(f"\n🎯 Alliance Distribution:")
        alliance_votes = {}
        cursor.execute("""
            SELECT 
                p.short_code,
                COUNT(o.id) as vote_count
            FROM Opinions o
            JOIN Candidates c ON o.candidate_id = c.id
            JOIN Parties p ON c.party_id = p.id
            GROUP BY p.short_code
            ORDER BY vote_count DESC
            LIMIT 10
        """)
        
        for row in cursor.fetchall():
            party = row['short_code']
            votes = row['vote_count']
            alliance = get_alliance(party)
            if alliance not in alliance_votes:
                alliance_votes[alliance] = 0
            alliance_votes[alliance] += votes
        
        for alliance in ['NDA', 'INDIA', 'Jan Suraj', 'AAP', 'Other']:
            if alliance in alliance_votes:
                emoji = {
                    'NDA': '🔶',
                    'INDIA': '🔴',
                    'Jan Suraj': '🟡',
                    'AAP': '🟢',
                    'Other': '⚪'
                }.get(alliance, '⚪')
                print(f"{emoji} {alliance}: {alliance_votes[alliance]} votes")
        
        print(f"\n💾 All votes saved to database successfully!")
        
    except mysql.connector.Error as err:
        print(f"❌ Database Error: {err}")
        if conn:
            conn.rollback()
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        if conn:
            conn.rollback()
        sys.exit(1)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("\n🔌 Database connection closed")

def main():
    print("=" * 60)
    print("   Bihar Opinion Poll - Random Vote Generator")
    print("=" * 60)
    print(f"   Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    print()
    
    # Confirm before proceeding
    print("⚠️  This will add random votes to ALL candidates")
    print("📊 Vote distribution:")
    print("   🔶 NDA: 7-12 votes per candidate (LEADING)")
    print("   🔴 INDIA: 4-7 votes per candidate")
    print("   🟡 Jan Suraj: 2-5 votes per candidate")
    print("   🟢 AAP: 1-3 votes per candidate")
    print("   ⚪ Others: 1-2 votes per candidate")
    print()
    
    response = input("Do you want to continue? (yes/no): ").strip().lower()
    
    if response != 'yes':
        print("\n❌ Operation cancelled")
        sys.exit(0)
    
    print("\n🚀 Starting vote generation...\n")
    add_votes_to_candidates()
    
    print(f"\n{'='*60}")
    print(f"   Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
